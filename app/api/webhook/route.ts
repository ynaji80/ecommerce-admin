import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import {headers} from "next/headers"
import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
    const body = await req.text();
    const sig = headers().get('Stripe-Signature') as string;
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err : any) {
        return new NextResponse('Webhook Error', {status: 400});
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;
    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.postal_code,
        address?.country,
    ]
    const addressString = addressComponents.filter((com) => com!=null).join(', ');
    if (event.type === 'checkout.session.completed') {
        const order = await prismadb.order.update({
            where:{
                id: session?.metadata?.orderId,
            },
            data:{
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || '',
            },
            include:{
                orderItems: true,
            }
        });
    }
        
    return new NextResponse('Webhook Received', {status: 200});
    
}
