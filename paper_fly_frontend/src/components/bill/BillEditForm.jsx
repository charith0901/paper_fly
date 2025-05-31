import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBillById, calculateBillTotalsAndUpdate } from "../../services/billService";
import { getAllDailyReceivesByBillId } from "../../services/dailyReceiveService";

export default function BillEditForm() {
    const { id } = useParams();
    const [bill, setBill] = useState(null);
    const [dailyReceives, setDailyReceives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBillData = async () => {
            try {
                setLoading(true);
                const bill_data = await getBillById(id);
                setBill(bill_data);
                const dailyReceivesData = await getAllDailyReceivesByBillId(id);
                setDailyReceives(dailyReceivesData);
            } catch (error) {
                console.error("Failed to fetch bill data", error);
                setError("Failed to fetch bill data");
            } finally {
                setLoading(false);
            }
        };
        fetchBillData();
    }, [id]);

    const handleGenerateBill = async () => {
        try {
            setLoading(true);
            setError(null);
            if (confirm("Are you sure you want to generate the bill calculation? This will update the bill totals.")) {
                await calculateBillTotalsAndUpdate(id);
                navigate(`/bills/${id}`);
            } else {
                alert("Bill calculation generation cancelled.");
            }
        } catch (error) {
            console.error("Failed to generate bill calculation", error);
            setError("Failed to generate bill calculation");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {loading ?
                <div className="text-center p-5">Loading...</div>
                : error ?
                    <div className="text-center p-5 text-red-500">{error}</div>
                    :
                    <div className="container mx-auto p-4">
                        <h1 className="text-2xl font-bold mb-4">Generate Bill Calculation</h1>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Bill Details</h2>
                            <div className="mb-4">
                                <label className="block text-gray-700">Bill ID:</label>
                                <span className="text-gray-900">{bill.id}</span>
                                <br />
                                <label className="block text-gray-700">Date Range:</label>
                                <span className="text-gray-900">{new Date(bill.startDate).toDateString()} to {new Date(bill.endDate).toDateString()}</span>
                                <br />
                                <label className="block text-gray-700">Profit Rate:</label>
                                <span className="text-gray-900">{bill.profitRate}%</span>
                                <br />
                            </div>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Daily Receives</h2>
                            {dailyReceives.length > 0 ? (
                                dailyReceives.map((receive) => (
                                    <div key={receive.id} className="mb-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-gray-700">Date: {new Date(receive.date).toDateString()}</p>
                                            </div>
                                            <div>
                                                <Link to={`/receive/edit/${receive.id}`} >
                                                    <button
                                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                    >
                                                        Edit
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <h3 className="text-lg font-semibold">Newspaper Copies:</h3>
                                            <ul className="list-disc pl-5">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Newspaper Name</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remain Copies</th>
                                                        </tr>
                                                    </thead>
                                                    {receive.newspapers.map((copy, index) => (
                                                        <tr key={index}>
                                                            <td className="pr-4">{copy.newspaper_name}</td>
                                                            <td>{copy.initialCopies - copy.soldCopies} out of {copy.initialCopies} copies</td>
                                                        </tr>
                                                    ))}
                                                </table>
                                            </ul>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No daily receives found for this bill.</p>
                            )}
                        </div>
                        <div className="text-center mt-4">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                onClick={() => handleGenerateBill()}
                            >
                                Proceed to generate the bill calculation based on the above data.
                            </button>
                        </div>
                    </div>
            }
        </div>
    );
}