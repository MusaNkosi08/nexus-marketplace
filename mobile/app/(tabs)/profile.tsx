import { Pressable, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

export default function ProfileScreen() {
  return <ScreenContainer className="flex-1 bg-[#EEE9DF] px-5 pt-8" edges={["top", "left", "right"]}><Text className="text-xs tracking-[3px] text-[#A35139]">NEXUS ACCOUNT</Text><Text className="mt-3 text-4xl font-semibold text-[#1B2632]">Your edit.</Text><View className="mt-8 rounded-lg bg-[#1B2632] p-6"><Text className="text-lg font-semibold text-[#EEE9DF]">Sign in to sync your bag.</Text><Text className="mt-2 leading-5 text-[#C9C1B1]">Use the NEXUS account flow to keep your catalogue, bag and orders available across devices.</Text><Pressable className="mt-6 rounded bg-[#FFB162] p-4"><Text className="text-center text-sm font-semibold tracking-[2px] text-[#1B2632]">SIGN IN</Text></Pressable></View><View className="mt-5 rounded-lg border border-[#C9C1B1] p-5"><Text className="text-base font-semibold text-[#1B2632]">SETTINGS</Text><Text className="mt-2 text-[#2C3B4D]">Notifications · Privacy · Help</Text></View></ScreenContainer>;
}
