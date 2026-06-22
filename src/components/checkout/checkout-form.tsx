"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/stores/cart-store"
import { createCheckoutPaymentIntent, createOrder } from "@/server/actions/checkout-actions"
import { CheckoutSteps, type CheckoutStepId } from "./checkout-steps"
import { ShippingForm, type ShippingFormData } from "./shipping-form"
import { PaymentFormWrapper } from "./payment-form"
import { ReviewForm } from "./review-form"
import { ExpressCheckout } from "./express-checkout"
import { CheckoutSummary } from "./checkout-summary"

const TAX_RATE = 0.08

export function CheckoutForm() {
  const router = useRouter()
  const { items, subtotal, discount, shipping, clearCart, coupon } = useCartStore()

  const [step, setStep] = useState<CheckoutStepId>("shipping")
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subtotalVal = subtotal()
  const discountVal = discount()
  const shippingCostVal = shipping?.cost ?? 0
  const taxAmount = Math.round((subtotalVal - discountVal) * TAX_RATE * 100) / 100
  const totalVal = Math.max(0, subtotalVal - discountVal + shippingCostVal + taxAmount)

  const cartItems = items.map((i) => ({
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    image: i.image,
    variantName: i.variantName,
  }))

  const handleShippingSubmit = useCallback(async (data: ShippingFormData) => {
    setShippingData(data)
    setLoading(true)
    setError(null)

    try {
      const result = await createCheckoutPaymentIntent({
        items: cartItems,
        subtotal: subtotalVal,
        shippingCost: shippingCostVal,
        taxAmount,
        discountAmount: discountVal,
        total: totalVal,
      })

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      setClientSecret(result.clientSecret ?? null)
      setPaymentIntentId(result.paymentIntentId ?? null)
      setStep("payment")
    } catch {
      setError("Failed to initialize payment")
    } finally {
      setLoading(false)
    }
  }, [cartItems, subtotalVal, shippingCostVal, taxAmount, discountVal, totalVal])

  const handlePaymentSuccess = useCallback(() => {
    setStep("review")
  }, [])

  const handlePlaceOrder = useCallback(async () => {
    if (!shippingData || !paymentIntentId) return

    setLoading(true)
    setError(null)

    try {
      const result = await createOrder({
        email: shippingData.email,
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        address1: shippingData.address1,
        address2: shippingData.address2,
        city: shippingData.city,
        state: shippingData.state,
        postalCode: shippingData.postalCode,
        country: "US",
        phone: shippingData.phone,
        shippingMethod: shippingData.shippingMethod,
        paymentIntentId,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        subtotal: subtotalVal,
        shippingCost: shippingCostVal,
        taxAmount,
        discountAmount: discountVal,
        total: totalVal,
        couponId: coupon?.code,
      })

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      clearCart()
      router.push(`/checkout/success?order=${result.orderNumber}`)
    } catch {
      setError("Failed to place order")
      setLoading(false)
    }
  }, [shippingData, paymentIntentId, items, subtotalVal, shippingCostVal, taxAmount, discountVal, totalVal, coupon, clearCart, router])

  const handleBack = useCallback(() => {
    if (step === "payment") {
      setStep("shipping")
    } else if (step === "review") {
      setStep("payment")
    }
  }, [step])

  const handleExpressCheckout = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await createCheckoutPaymentIntent({
        items: cartItems,
        subtotal: subtotalVal,
        shippingCost: shippingCostVal,
        taxAmount,
        discountAmount: discountVal,
        total: totalVal,
      })

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      setClientSecret(result.clientSecret ?? null)
      setPaymentIntentId(result.paymentIntentId ?? null)
      setStep("payment")
    } catch {
      setError("Failed to process express checkout")
    } finally {
      setLoading(false)
    }
  }, [cartItems, subtotalVal, shippingCostVal, taxAmount, discountVal, totalVal])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      <div className="lg:col-span-2">
        <div className="mb-8">
          <CheckoutSteps current={step} />
        </div>

        {error && (
          <div className="mb-6 p-3 border border-destructive bg-destructive/5 text-destructive text-sm">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === "shipping" && (
              <div className="space-y-6">
                <ExpressCheckout
onApplePay={() => handleExpressCheckout()}
onGooglePay={() => handleExpressCheckout()}
                  loading={loading}
                />
                <ShippingForm onSubmit={handleShippingSubmit} />
              </div>
            )}

            {step === "payment" && clientSecret && (
              <PaymentFormWrapper
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
                onBack={handleBack}
              />
            )}

            {step === "review" && (
              <ReviewForm
                shippingData={shippingData!}
                cartItems={cartItems}
                subtotal={subtotalVal}
                shippingCost={shippingCostVal}
                taxAmount={taxAmount}
                discountAmount={discountVal}
                total={totalVal}
                loading={loading}
                onBack={handleBack}
                onConfirm={handlePlaceOrder}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="lg:col-span-1">
        <CheckoutSummary
          items={cartItems}
          subtotal={subtotalVal}
          shippingCost={shippingCostVal}
          taxAmount={taxAmount}
          discountAmount={discountVal}
          total={totalVal}
        />
      </div>
    </div>
  )
}
