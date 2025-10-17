import { useMutation, useQueryClient } from '@tanstack/react-query'

import api from '../../../lib/axios-config'

interface GetSMSParams {
  target: any
  cost: number
  balance: number
  actualCost: number
}

export const useGetSMSNumber = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ target, cost, balance, actualCost }: GetSMSParams) => {
      if (!target.service || !target.country) throw new Error("Missing service or country")
      if (cost > balance) throw new Error("Insufficient balance")

      const { data } = await api.post("/api/sms/get-number", {
        ...target,
        price: cost,
        actual: actualCost,
      }, {
        headers: { "x-requires-auth": true }
      })

      if (data.phone?.error_msg) throw new Error(data.phone.error_msg)
      return data
    },

    onSuccess: (data) => {
      const { purchased_number, sms } = data.table
      const { request_id } = data.phone
      const { debitRef } = data
     
      
      queryClient.setQueryData(['smsRequest'], {
        purchased_number,
        request_id,
        debitRef,
        cost: data.price,
        sms,
        createdAt: Date.now(),
      })
    },

    onError: (error: any) => {
      console.error("SMS fetch failed:", error)
    }
  })
}
