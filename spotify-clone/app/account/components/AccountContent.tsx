'use client';

import Button from '@/components/Button';
import SubscribeModal from '@/components/SubscribeModal';
import useSubscribeModal from '@/hooks/useSubscribeModal';
import { useUser } from '@/hooks/useUser';
import { postData } from '@/libs/helpers';
import { subscribe } from 'diagnostics_channel';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from '../loading';

const AccountContent = () => {
  const router = useRouter();
  const subcribeModal = useSubscribeModal();
  const { isLoading, subscription, user } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, router, user]);

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link',
      });
      window.location.assign(url);
    } catch (error) {
      toast.error((error as Error).message);
    }
    setLoading(false);
  };

  if (isLoading) return <Loading />;

  return (
    <div className='mb-7 px-6'>
      {!subscription && (
        <div className='flex flex-col gap-y-4'>
          <p>No active Plan</p>
          <Button onClick={subcribeModal.onOpen} className='w-[300px]'>
            Subscribe
          </Button>
        </div>
      )}
      {subscription && (
        <div className='flex flex-col gap-y-4'>
          <p>
            You are currently on the{' '}
            <b>{subscription?.prices?.products?.name}</b> plan.
          </p>
          <Button
            className='w-[300px]'
            disabled={loading || isLoading}
            onClick={redirectToCustomerPortal}
          >
            Open customer portal
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountContent;
