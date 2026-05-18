export const fakeLogin = (data) => {

  return new Promise((resolve, reject) => {

    setTimeout(() => {

      if (
        data.email === "admin@gmail.com" &&
        data.password === "123456"
      ) {

        resolve({
          token: "fake-jwt-token",
          user: {
            name: "Admin",
            email: data.email,
            role: "admin"
          }
        });

      } else {

        reject({
          message: "Sai tài khoản hoặc mật khẩu"
        });
      }

    }, 1500);

  });
};