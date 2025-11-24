import React, { useEffect, useState } from "react";
import { getStockAlerts } from "../../utils/stockApi";

type StockAlert = {
  product_name: string;
  remaining_stock: number;
  message: string;
};

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [premiumError, setPremiumError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    getStockAlerts()
      .then((res: { alert: StockAlert[] }) => setAlerts(res.alert || []))
      .catch((err: { message?: string }) => {
        if (err.message?.includes("premium")) setPremiumError(err.message);
        setAlerts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {premiumError && <div className="text-red-500 mb-4">{premiumError}</div>}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <h2 className="text-lg font-semibold mb-2">Stock Alerts</h2>
          <ul>
            {loading && <li>Loading...</li>}
            {!loading && alerts.length === 0 && <li>No alerts</li>}
            {alerts.map((alert, idx) => (
              <li key={idx} className="mb-2">
                <strong>{alert.product_name}</strong> — {alert.message}
                <span className="ml-2 text-xs text-yellow-700">
                  Stock: {alert.remaining_stock}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
