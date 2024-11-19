import { useFormContext } from 'react-hook-form';
import { CameraQrScanner } from '../camera/camera-qr-scanner';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '../ui/form';
import { Input } from '../ui/input';
import { AccountSelector } from './account-selector';

interface AccountSelectAndInput {
  disabled?: boolean;
}

export function AccountSelectAndInput({ disabled }: AccountSelectAndInput) {
  const { control } = useFormContext();
  return (
    <div className="group">
      <FormLabel className="text-foreground text-lg">To</FormLabel>
      <FormField
        control={control}
        name="to"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="my-1 flex w-full items-center justify-between gap-2">
                <Input
                  disabled={disabled}
                  id="to"
                  className="block h-auto w-full flex-1 border-transparent bg-transparent py-1 pl-0 text-left font-medium text-base shadow-none placeholder:text-muted-foreground placeholder:text-sm focus:border-transparent focus:ring-transparent focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-transparent"
                  placeholder="Ethereum address or ENS name"
                  {...field}
                  value={field.value || ''}
                />
                <div className="flex items-center gap-x-2">
                  <AccountSelector
                    disabled={disabled}
                    value={field.value}
                    onValueChange={(data) => field.onChange(data)}
                  />
                  <CameraQrScanner
                    onScanSuccess={(data) => field.onChange(data)}
                  />
                </div>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <FormDescription>Account receiving the assets/tokens.</FormDescription>
    </div>
  );
}
