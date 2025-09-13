import { VStack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface ComingSoonProps {
  title: string;
  icon: string;
}

const ComingSoon = ({ title, icon }: ComingSoonProps) => {
  const { t } = useTranslation();

  return (
    <VStack spacing={4} align="center" py={20}>
      <Text fontSize="4xl" color="white">
        {icon} {t(title)}
      </Text>
      <Text color="#9ca3af">{t("Coming soon...")}</Text>
    </VStack>
  );
};

export default ComingSoon;
