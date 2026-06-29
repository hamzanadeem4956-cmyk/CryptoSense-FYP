require("dotenv").config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY in backend/.env");
}

const stripe = require("stripe")(stripeSecretKey);

const Subscription = require("../models/Subscription");
const User = require("../models/User");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const mapStripeStatus = (status) => {
  if (status === "active" || status === "trialing") return "active";
  if (status === "canceled") return "cancelled";
  if (status === "past_due" || status === "unpaid") return "expired";
  return "inactive";
};

const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });

    if (!subscription) {
      return res.json({
        message: "No subscription found",
        subscription: null,
      });
    }

    return res.json({
      message: "Subscription fetched successfully",
      subscription,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const createCheckoutSession = async (req, res) => {
  try {
    const priceId = process.env.STRIPE_PRICE_ID;

    if (!priceId) {
      return res.status(400).json({
        message: "STRIPE_PRICE_ID is missing in .env",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: req.user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: req.user._id.toString(),
      },
      success_url: `${FRONTEND_URL}/subscription?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/subscription?canceled=1`,
    });

    return res.json({ url: session.url });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to create checkout session",
      error: error.message,
    });
  }
};

const createPortalSession = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });

    const customerId =
      req.user.stripeCustomerId || subscription?.stripeCustomerId;

    if (!customerId) {
      return res.status(400).json({
        message: "No Stripe customer found for this account",
      });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${FRONTEND_URL}/subscription`,
    });

    return res.json({ url: portalSession.url });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to create portal session",
      error: error.message,
    });
  }
};

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;

        if (!userId) break;

        const stripeSubscriptionId = session.subscription || null;
        const stripeCustomerId = session.customer || null;

        let stripeSubscription = null;
        if (stripeSubscriptionId) {
          stripeSubscription = await stripe.subscriptions.retrieve(
            stripeSubscriptionId
          );
        }

        const currentPeriodEnd = stripeSubscription?.current_period_end
          ? new Date(stripeSubscription.current_period_end * 1000)
          : null;

        await Subscription.findOneAndUpdate(
          { user: userId },
          {
            user: userId,
            stripeCustomerId,
            stripeSubscriptionId,
            status: "active",
            startedAt: new Date(),
            currentPeriodEnd,
            cancelledAt: null,
          },
          { upsert: true, new: true, runValidators: true }
        );

        await User.findByIdAndUpdate(userId, {
          stripeCustomerId,
          subscriptionStatus: "active",
          subscriptionEndsAt: currentPeriodEnd,
        });

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const stripeSub = event.data.object;

        const user = await User.findOne({
          stripeCustomerId: stripeSub.customer,
        });

        if (!user) break;

        const status =
          event.type === "customer.subscription.deleted"
            ? "cancelled"
            : mapStripeStatus(stripeSub.status);

        const currentPeriodEnd = stripeSub.current_period_end
          ? new Date(stripeSub.current_period_end * 1000)
          : null;

        await Subscription.findOneAndUpdate(
          { user: user._id },
          {
            user: user._id,
            stripeCustomerId: stripeSub.customer,
            stripeSubscriptionId: stripeSub.id,
            status,
            currentPeriodEnd,
            cancelledAt: status === "cancelled" ? new Date() : null,
          },
          { upsert: true, new: true, runValidators: true }
        );

        await User.findByIdAndUpdate(user._id, {
          subscriptionStatus: status,
          subscriptionEndsAt: status === "active" ? currentPeriodEnd : null,
        });

        break;
      }

      default:
        break;
    }

    return res.json({ received: true });
  } catch (error) {
    return res.status(500).json({
      message: "Webhook handling failed",
      error: error.message,
    });
  }
};

module.exports = {
  getMySubscription,
  createCheckoutSession,
  createPortalSession,
  handleStripeWebhook,
};