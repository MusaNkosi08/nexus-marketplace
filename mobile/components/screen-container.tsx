import { PropsWithChildren } from "react";
import { SafeAreaView, type SafeAreaViewProps } from "react-native-safe-area-context";

export function ScreenContainer({ children, className, ...props }: PropsWithChildren<SafeAreaViewProps & { className?: string }>) {
  return <SafeAreaView {...props} className={className}>{children}</SafeAreaView>;
}
