import { useParams } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import quotations from '../../mock/quotations.json';
import customers from '../../mock/customers.json';
import destinations from '../../mock/destinations.json';
import excursions from '../../mock/excursions.json';
import hotels from '../../mock/hotels.json';

export default function QuotationPreview() {
    const { id } = useParams();
    const quotation = quotations.find((q) => String(q.id) === String(id));

    if (!quotation)
        return (
            <AppLayout>
                <div className="text-center text-gray-500">Quotation not found</div>
            </AppLayout>
        );

    const customer = customers.find((c) => c.id === quotation.customerId);

    return (
        <AppLayout>
            <div className="bg-white p-10 shadow-lg rounded-2xl max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#0e4b5a]">Travel Itinerary & Costing</h1>
                    <p className="text-gray-500">Quotation Reference: #{quotation.id}</p>
                </div>

                {/* Customer Info */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">Guest Information</h2>
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <p><strong>Name:</strong> {customer?.name}</p>
                        <p><strong>Email:</strong> {customer?.email}</p>
                        <p><strong>Phone:</strong> {customer?.phone}</p>
                        <p><strong>Country:</strong> {customer?.country}</p>
                    </div>
                </div>

                {/* Itinerary */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">Itinerary</h2>
                    <div className="space-y-4">
                        {quotation.itinerary?.map((day, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-xl border">
                                <h3 className="font-semibold text-lg">Day {day.day}</h3>
                                <p><strong>Destination:</strong> {day.destination}</p>
                                <p><strong>Hotel:</strong> {day.hotel}</p>
                                <p><strong>Excursion:</strong> {day.excursion}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Costing Breakdown */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">Cost Breakdown</h2>
                    <table className="w-full text-left border rounded-xl overflow-hidden">
                        <thead className="bg-[#0e4b5a] text-white">
                            <tr>
                                <th className="py-2 px-4">Item</th>
                                <th className="py-2 px-4">Amount (LKR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="py-2 px-4">Hotel Cost</td>
                                <td className="py-2 px-4">{quotation.costing.hotelCost.toLocaleString()}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 px-4">Transport Cost</td>
                                <td className="py-2 px-4">{quotation.costing.transportCost.toLocaleString()}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 px-4">Excursion Cost</td>
                                <td className="py-2 px-4">{quotation.costing.excursionCost.toLocaleString()}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 px-4">Miscellaneous</td>
                                <td className="py-2 px-4">{quotation.costing.misc.toLocaleString()}</td>
                            </tr>
                        </tbody>
                        <tfoot className="bg-gray-100 font-semibold">
                            <tr>
                                <td className="py-2 px-4">Total</td>
                                <td className="py-2 px-4 text-lg text-[#0e4b5a]">
                                    {quotation.total.toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-500 mt-10 text-sm">
                    <p>Thank you for choosing Travellers Isle.</p>
                    <p>We look forward to making your Sri Lankan journey unforgettable.</p>
                </div>
            </div>
        </AppLayout>
    );
}