import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

// Load Razorpay Script
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

// ================= BUY COURSE =================

export async function buyCourse(
  token,
  courses,
  userDetails,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...");

  try {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("ORDER RESPONSE :", orderResponse);

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,

      amount: orderResponse.data.data.amount,
      currency: orderResponse.data.data.currency,
      order_id: orderResponse.data.data.id,

      name: "StudyNotion",
      description: "Thank You For Purchasing The Course",
      image: rzpLogo,

      prefill: {
        name: `${userDetails.firstName}`,
        email: userDetails.email,
      },

      handler: async function (response) {
        console.log("STEP 1 : Payment Success");
        console.log(response);

        try {
          // Uncomment later after verify works
          /*
          await sendPaymentSuccessEmail(
            response,
            orderResponse.data.data.amount,
            token
          );
          */

          console.log("STEP 2 : Calling Verify Payment");

          await verifyPayment(
            {
              ...response,
              courses,
            },
            token,
            navigate,
            dispatch
          );

          console.log("STEP 3 : Verify Completed");
        } catch (error) {
          console.log("HANDLER ERROR :", error);
        }
      },
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.open();

    paymentObject.on("payment.failed", function (response) {
      console.log(response.error);
      toast.error("Payment Failed");
    });
  } catch (error) {
    console.log("PAYMENT API ERROR :", error);
    toast.error("Could not make payment");
  }

  toast.dismiss(toastId);
}

// ================= SEND SUCCESS EMAIL =================

async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("SUCCESS EMAIL SENT");
  } catch (error) {
    console.log("EMAIL ERROR :", error);
  }
}

// ================= VERIFY PAYMENT =================

async function verifyPayment(bodyData, token, navigate, dispatch) {
  console.log("VERIFY PAYMENT FUNCTION START");

  const toastId = toast.loading("Verifying Payment...");

  dispatch(setPaymentLoading(true));

  try {
    const response = await apiConnector(
      "POST",
      COURSE_VERIFY_API,
      bodyData,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("VERIFY RESPONSE :", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Payment Successful");

    dispatch(resetCart());

    navigate("/dashboard/enrolled-courses");
  } catch (error) {
    console.log("VERIFY PAYMENT ERROR :", error);
    toast.error("Could not verify payment");
  }

  dispatch(setPaymentLoading(false));
  toast.dismiss(toastId);
}