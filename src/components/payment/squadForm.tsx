import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema, PaymentFormData } from './paySchema';
import ClipLoader from 'react-spinners/ClipLoader';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => Promise<void> | void;
  minAmount?: number;
  isLoading?: boolean;
}

export const PaymentForm = ({ 
  onSubmit, 
  minAmount = 1000,
  isLoading = false 
}: PaymentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: 'onChange',
  });

  const handleFormSubmit = async (data: PaymentFormData) => {
    await onSubmit(data);
  };

  const showLoader = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full flex flex-col gap-3">
      <div className="text-[12px] flex justify-between w-full">
        <Label htmlFor="amount" className="font-semibold dark:text-white">
          Enter Amount
        </Label>
        <span className="text-gray-400">
          Min is ₦{minAmount.toLocaleString()}
        </span>
      </div>

      <div className="space-y-1">
        <Input
          {...register('amount', { valueAsNumber: true })}
          type="number"
          placeholder="Enter amount"
          id="amount"
          className={`border dark:text-white border-gray-300 rounded-md focus:ring-2 border-solid focus:ring-blue-500 focus:outline-none h-10 pl-3 ${
            errors.amount ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          disabled={showLoader}
        />
        {errors.amount && (
          <p className="text-red-500 text-xs">{errors.amount.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={showLoader}
        className="h-10 bg-[#0032a5] rounded-md grid place-items-center text-white hover:bg-[#002080] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {showLoader ? <ClipLoader size={20} color="#ffffff" /> : 'Submit'}
      </Button>
    </form>
  );
};



