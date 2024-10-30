'use client'

import { ConfigProvider } from 'antd'
import { ReactNode } from 'react'

export default function AntConfigProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'var(--font-lexend)',
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
} 