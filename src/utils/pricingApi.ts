export async function getPricingPlans(): Promise<{ id: string; name: string; price: string; features: string[]; }[]> {
  const res = await fetch('/api/pricing/plans');
  return await res.json();
}

export async function getUserSubscriptionStatus(): Promise<{ planName: string }> {
  const res = await fetch('/api/pricing/subscription');
  return await res.json();
}

export async function updateUserSubscription(planId: string): Promise<any> {
  const res = await fetch('/api/pricing/subscribe', {
    method: 'POST',
    body: JSON.stringify({ planId }),
    headers: { 'Content-Type': 'application/json' },
  });
  return await res.json();
}