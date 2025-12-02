import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { useMutation } from "react-query";

export interface CheckoutInputType {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  save: boolean;
  note: string;
}

export interface CreateOrderPayload {
  customer: {
    name: string;
    email: string;
    phone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  items: Array<{
    product: string;
    quantity: number;
    price: number;
    name: string;
    image?: string;
  }>;
  total: number;
  paymentInfo: {
    method: string;
    transactionId?: string;
    status?: string;
  };
}

async function checkout(input: CreateOrderPayload) {
  const { data } = await http.post(API_ENDPOINTS.ORDERS, input);
  return data;
}

export const useCheckoutMutation = () => {
  return useMutation((input: CreateOrderPayload) => checkout(input));
};
