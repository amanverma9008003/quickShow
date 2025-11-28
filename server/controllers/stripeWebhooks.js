import stripe from'stripe';
import Booking from '../models/Booking.js';

export const stripeWebhooks = async (req, res) => {
    const stripeInstace = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig= req.headers['stripe-signature'];

    let event;

    try{
        event = stripeInstace.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPWE_WEBHOOK_SECRET,
        
        );
    }catch(err){
        // console.log('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try{
        switch(event.type){
            case 'payment_intent.succeeded':{
                    const paymentIntent = event.data.object;
                    const sessionList = await stripeInstace.checkout.sessions.list({
                        payment_intent: paymentIntent.id
                    });
                    const session = sessionList.data[0];
                    const {bookingId} = session.metadata.bookingId;
                    //Update booking status to paid
                    await Booking.findByIdAndUpdate(bookingId, {isPaid: true, paymentLink:" " });
                    //console.log(`Booking ${bookingId} paid successfully`);
                }
                break;

            default:
                //console.log(`Unhandled event type ${event.type}`);
                break;
        }
        res.json({received: true});
    }catch(err){
        //console.log(`Error processing webhook event: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
}