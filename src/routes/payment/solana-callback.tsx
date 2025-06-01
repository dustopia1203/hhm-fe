import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export const Route = createFileRoute('/payment/solana-callback')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      amount: search.amount as number
    }
  }
})

function RouteComponent() {
  const { amount } = Route.useSearch();
  const [solanaToken, setSolanaToken] = useState(0);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const checkIntervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchSolanaPaymentQrCode = async () => {
      try {
        const exchangeResponse = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=vnd");
        const exchangeRate = exchangeResponse.data.solana.vnd;
        const solTokens = amount / exchangeRate;
        const roundedSolTokens = parseFloat(solTokens.toFixed(5));

        setSolanaToken(roundedSolTokens);

        const createPayment = await axios.post("http://localhost:8081/api/payment-qr", {
          amount: roundedSolTokens
        });

        console.log(createPayment.data);

        const { qrCode, reference } = createPayment.data;
        setQrCode(qrCode);
        setReference(reference);
        setIsLoading(false);

        startPaymentCheck(reference);

        startCountdown();
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    };

    fetchSolanaPaymentQrCode();

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [amount]);

  const startCountdown = () => {
    const endTime = Date.now() + 60000; // 60 seconds from now

    timerRef.current = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0 || status === 'success') {
        if (timerRef.current) clearInterval(timerRef.current);
        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      }

      if (remaining === 0) {
        window.close();
      }
    }, 500)
  };

  const startPaymentCheck = (ref: string) => {
    handleCheckPayment(ref);
    checkIntervalRef.current = window.setInterval(() => {
      handleCheckPayment(ref);
    }, 20000);
  };

  const handleCheckPayment = async (ref: string) => {
    try {
      const checkPayment = await axios.get(`http://localhost:8081/api/check-payment/${ref}`);
      const { status } = checkPayment.data;
      setStatus(status);

      if (status === "success") {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePayment = () => {
    if (window.opener) {
      window.opener.postMessage({
        success: true,
        reference,
        solanaToken
      }, "*");

      setTimeout(() => window.close());
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="text-white">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 text-white">
      <div className="w-full max-w-xs">
        <h1 className="text-xl font-bold mb-4 text-center">Thanh toán Solana</h1>

        {/* Timer notice */}
        <div className="mb-4 bg-yellow-800/30 border border-yellow-700 rounded p-2 text-center">
          <div className="text-yellow-300 text-sm">
            Mã thanh toán có hiệu lực trong vòng 1 phút
          </div>
          <div className="text-white font-bold mt-1">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Payment Info */}
        <div className="mb-4 bg-gray-800 p-3 rounded">
          <div className="flex justify-between mb-2">
            <span>Số tiền:</span>
            <span>₫{amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>SOL:</span>
            <span>{solanaToken} SOL</span>
          </div>
        </div>

        {/* Status */}
        {status && (
          <div className="mb-4 text-center">
            <span className={status === "success" ? "text-green-400" : "text-yellow-400"}>
              {status === "success"
                ? "✓ Đã thanh toán"
                : "⏳ Đang chờ thanh toán"}
            </span>
          </div>
        )}

        {/* QR Code */}
        {qrCode && (
          <div className="flex justify-center mb-4">
            <div className="bg-white p-2 rounded">
              <img src={qrCode} alt="QR Code" className="w-full" />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={() => window.close()}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            Đóng
          </button>

          <button
            onClick={handlePayment}
            disabled={status !== "success"}
            className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-600"
          >
            Thanh toán đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}
