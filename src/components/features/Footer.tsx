function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 w-screen bottom-0 left-0">
      <div className="max-w-screen-xl mx-auto grid grid-cols-3 gap-4 px-4">
        {/* Logo and Google Map */}
        <div>
          <h3 className="text-lg font-bold mb-4">HHMShop</h3>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold">Về chúng tôi</h4>
          <h4 className="font-semibold">Hỗ trợ khách hàng</h4>
          <h4 className="font-semibold">Chăm sóc khách hàng</h4>
        </div>

        {/* Payment and Shipping */}
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold">Phương thức thanh toán</h4>
          <h4 className="font-semibold">Đơn vị vận chuyển</h4>
          <h4 className="font-semibold">Kết nối</h4>
        </div>
      </div>
      <div className="text-center mt-4 text-sm">
        &copy; 2024 HHMShop
      </div>
    </footer>
  );
}

export default Footer;