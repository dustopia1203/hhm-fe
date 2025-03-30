interface ValidateConstraints {
  [key: string]: {
    [constraint: string]: {
      value: number | string | RegExp,
      message: string,
    },
  },
}

const validateConstraints: ValidateConstraints = {
  USERNAME: {
    MIN_LENGTH: {
      value: 6,
      message: "Tên đăng nhập tối thiểu 6 ký tự",
    },
    MAX_LENGTH: {
      value: 50,
      message: "Tên đăng nhập tối đa 50 ký tự",
    },
    FORMAT: {
      value: /^[A-Za-z0-9._]+$/,
      message: "Tên đăng nhập chỉ chứa các ký tự chữ cái viết hoa, viết thường, chữ số, '.' hoặc '_'",
    },
  },
  PASSWORD: {
    MIN_LENGTH: {
      value: 6,
      message: "Mật khẩu tối thiểu 6 ký tự",
    },
    MAX_LENGTH: {
      value: 50,
      message: "Mật khẩu tối đa 50 ký tự",
    },
    FORMAT: {
      value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&^()_=+\-{}~|'"]{6,}$/,
      message: "Mật khẩu phải chứa ít nhất 1 chữ, 1 số, 1 ký tự đặc biệt",
    },
  },
  EMAIL: {
    MAX_LENGTH: {
      value: 50,
      message: "Email tối đa 50 ký tự",
    },
    FORMAT: {
      value: /^\s*[a-zA-Z0-9-_.]{1,50}[a-zA-Z0-9]{1,50}@[a-zA-Z0-9_-]{2,}(\.[a-zA-Z0-9]{2,4}){1,2}\s*$/,
      message: "Email sai định dạng",
    },
  },
  CODE: {
    MAX_LENGTH: {
      value: 36,
      message: "Mã tối đa 36 ký tự",
    },
    FORMAT: {
      value: /^[A-Za-z0-9._]+$/,
      message: "Mã chỉ chứa các ký tự chữ cái viết hoa, viết thường, chữ số, '.' hoặc '_'",
    },
  },
  NAME: {
    MAX_LENGTH: {
      value: 100,
      message: "Tên tối đa 100 ký tự",
    },
  },
  PHONE: {
    MAX_LENGTH: {
      value: 20,
      message: "Số điện thoại tối đa 20 ký tự",
    },
    FORMAT: {
      value: /^(\+[0-9]+[- .]*)?(\([0-9]+\)[- .]*)?([0-9][0-9- .]+[0-9])$/,
      message: "Số điện thoại sai định dạng"
    }
  }
}

export default validateConstraints;
