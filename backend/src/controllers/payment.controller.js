import mercadopago from "mercadopago";
import { HOST, MERCADOPAGO_API_KEY } from '../config.js';

export const createOrder = async (req, res) => {

    mercadopago.configure({
        access_token: MERCADOPAGO_API_KEY,
    });

    const result = await mercadopago.preferences.create({
        items: [
            {
                title: "Planificador y Presupuesto avanzado",
                unit_price: 19.99,
                currency_id: "USD",
                quantity: 1,
            },
        ],
        notification_url: "https://58a5-181-66-206-159.ngrok.io/webhook",
        back_urls: {
            success: `http://localhost:5173/d`,
            failure: ``,
            pending: ``,
        },
        auto_return: 'approved',
        binary_mode: true,
    });

    console.log(result);
    res.send(result.body);
};

export const receiveWebhook = async (req, res) => {
    const payment = req.query;

    try {

        if (payment.type == "payment") {
            const data = await mercadopago.payment.findById(payment["data.id"]);
            console.log(data);
        }
        //store in database

        res.sendStatus(204);
    } catch (error) {
        console.log(error)
        return res.sendStatus(500).json({ error: error.message });
    }
};

