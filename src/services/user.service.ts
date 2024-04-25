import axios from "axios";
axios.defaults.withCredentials = true;

export const userServiceRegister = async (formData: object) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/register`,
    formData
  );
  return res;
};

export const userServiceLogin = async (userData: object) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/login`,
    userData,
    {
      withCredentials: true,
    }
  );
  return res;
};

export const userServiceMe = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/me`,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const userServiceGetSingle = async (id: number | null) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/single/${id}`
  );
  return res.data;
};

export const userServiceRestorePassword = async (email: string) => {
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/restore-password`,
    {
      email,
    }
  );
  return res;
};

export const userServiceValidateTokenToRestorePassword = async (
  token: string
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/validate-token${token}`
  );
  return res;
};

export const userServiceOverwritePassword = async (
  password: string,
  token: string
) => {
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/overwrite-password/${token}`,
    {
      password,
    },
    { withCredentials: true }
  );
  return res;
};

export const userServiceLogout = async () => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/logout`,
    { withCredentials: true }
  );
  return res;
};

export const userServiceConfirmEmail = async (token: string) => {
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/confirm-email/${token}`
  );
  return res;
};

export const resendConfirmationEmail = async (token: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/resend-confirmation-email/${token}`
  );
  return res;
};

export const userServiceGetAll = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/`
  );
  return res.data;
};

export const userServiceGetDeliverymen = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/deliverymen`
  );
  return res.data;
};

export const userServiceGetDeliverymenWithPackagesQuantityByDate = async (
  date: string
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/deliverymen-with-packages-quantity-by-date/${date}`
  );
  return res.data;
};

export const userServiceGetNumberOfDeliverymenAndEnadledDeliverymen =
  async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/number-of-deliverymen-and-enabled-deliverymen`
    );
    return res.data;
  };

export const userServiceEnableDeliveryman = async (userId: number) => {
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/enable-deliveryman/${userId}`
  );
  return res;
};

export const userServiceDisableDeliveryman = async (userId: number) => {
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_LOCAL_URL}/users/disable-deliveryman/${userId}`
  );
  return res;
};
