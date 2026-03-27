import type { Metadata } from 'next';
import { OrderDetailClient } from './OrderDetailClient';

interface Props {
  params: { orderId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `주문 상세 ${params.orderId} | OT-CHAWON`,
    description: '주문 상세 정보를 확인하세요.',
  };
}

export default function OrderDetailPage({ params }: Props) {
  return <OrderDetailClient orderId={params.orderId} />;
}
