import React, { LegacyRef } from "react";
import { Text } from "@chakra-ui/react"

export const ChatMessage = ({ message }) => {
  const elRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    elRef.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  }, [message])

  return (
    <Text
      ref={elRef}
      paddingBottom={2}
      as={message.systemMessage && "i"}
      opacity={message.systemMessage && "0.5"}
    >
      {message.from && <span style={{ fontWeight: 800, color: message.from.nickColor || 'black' }}>{message.from.name}:</span>} {message.message}
    </Text>
  )
};