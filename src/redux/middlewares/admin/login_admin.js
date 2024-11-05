import { toast } from "react-toastify";
import { LoginAdminAction } from "../../action/admin/loginAdmin";
import Cookies from "js-cookie";
export const getLoginAdmin = (value) => {
  return async (dispatch) => {
    try {
      toast.dismiss();
      const url = `${import.meta.env.VITE_FASTFOOD_ADMIN_API}/admin/login`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: value.email, password: value.password }),
      });

      const data = await response.json();
      console.log(data);

      if (!data.ok) {
        toast.error(data.message);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      dispatch(LoginAdminAction(data));
      Cookies.set("apikey_dashboard", data.api_key);
      toast.success(data.message);

      return data;
    } catch (error) {
      console.error("Fetch error:", error.message);

      throw error;
    }
  };
};