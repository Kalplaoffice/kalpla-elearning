'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface PricingData {
  price: number;
  isFree: boolean;
  currency: string;
  discountCoupons: Coupon[];
  emiOption: boolean;
  emiMonths: number;
  freePreviewLectures: string[];
  revenueSharing: RevenueSharing;
  referralTracking: ReferralTracking;
  courseBundling: CourseBundle[];
  subscriptionModel: SubscriptionModel;
  promotions: Promotion[];
}

interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableCourses: string[];
}

interface RevenueSharing {
  instructorPercentage: number;
  platformPercentage: number;
  paymentProcessingFee: number;
}

interface ReferralTracking {
  enabled: boolean;
  instructorAffiliateCode: string;
  commissionPercentage: number;
  cookieDuration: number; // days
}

interface CourseBundle {
  id: string;
  name: string;
  courses: string[];
  bundlePrice: number;
  discountPercentage: number;
  isActive: boolean;
}

interface SubscriptionModel {
  enabled: boolean;
  planType: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  monthlyPrice: number;
  yearlyPrice: number;
  lifetimePrice: number;
  features: string[];
}

interface Promotion {
  id: string;
  name: string;
  type: 'SALE' | 'FLASH_SALE' | 'EARLY_BIRD' | 'BULK_DISCOUNT';
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableCourses: string[];
}

const PricingManager: React.FC<{
  pricingData: PricingData;
  onPricingChange: (data: PricingData) => void;
}> = ({ pricingData, onPricingChange }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'coupons' | 'bundles' | 'subscriptions' | 'promotions'>('basic');
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [isAddingBundle, setIsAddingBundle] = useState(false);
  const [isAddingPromotion, setIsAddingPromotion] = useState(false);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'PERCENTAGE' as const,
    discountValue: 0,
    expiryDate: '',
    usageLimit: 0,
    applicableCourses: [] as string[]
  });

  const [newBundle, setNewBundle] = useState({
    name: '',
    courses: [] as string[],
    bundlePrice: 0,
    discountPercentage: 0
  });

  const [newPromotion, setNewPromotion] = useState({
    name: '',
    type: 'SALE' as const,
    discountPercentage: 0,
    startDate: '',
    endDate: '',
    applicableCourses: [] as string[]
  });

  const addCoupon = () => {
    if (newCoupon.code && newCoupon.discountValue > 0) {
      const coupon: Coupon = {
        id: `coupon-${Date.now()}`,
        ...newCoupon,
        usedCount: 0,
        isActive: true
      };
      onPricingChange({
        ...pricingData,
        discountCoupons: [...pricingData.discountCoupons, coupon]
      });
      setNewCoupon({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: 0,
        expiryDate: '',
        usageLimit: 0,
        applicableCourses: []
      });
      setIsAddingCoupon(false);
    }
  };

  const addBundle = () => {
    if (newBundle.name && newBundle.courses.length > 0) {
      const bundle: CourseBundle = {
        id: `bundle-${Date.now()}`,
        ...newBundle,
        isActive: true
      };
      onPricingChange({
        ...pricingData,
        courseBundling: [...pricingData.courseBundling, bundle]
      });
      setNewBundle({
        name: '',
        courses: [],
        bundlePrice: 0,
        discountPercentage: 0
      });
      setIsAddingBundle(false);
    }
  };

  const addPromotion = () => {
    if (newPromotion.name && newPromotion.discountPercentage > 0) {
      const promotion: Promotion = {
        id: `promotion-${Date.now()}`,
        ...newPromotion,
        isActive: true
      };
      onPricingChange({
        ...pricingData,
        promotions: [...pricingData.promotions, promotion]
      });
      setNewPromotion({
        name: '',
        type: 'SALE',
        discountPercentage: 0,
        startDate: '',
        endDate: '',
        applicableCourses: []
      });
      setIsAddingPromotion(false);
    }
  };

  const toggleCoupon = (couponId: string) => {
    onPricingChange({
      ...pricingData,
      discountCoupons: pricingData.discountCoupons.map(coupon =>
        coupon.id === couponId ? { ...coupon, isActive: !coupon.isActive } : coupon
      )
    });
  };

  const deleteCoupon = (couponId: string) => {
    onPricingChange({
      ...pricingData,
      discountCoupons: pricingData.discountCoupons.filter(coupon => coupon.id !== couponId)
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const renderBasicPricing = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Pricing</CardTitle>
          <CardDescription>Set your course price and basic monetization options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Course Price</label>
              <div className="flex items-center gap-2">
                <select
                  value={pricingData.currency}
                  onChange={(e) => onPricingChange({ ...pricingData, currency: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
                <Input
                  type="number"
                  value={pricingData.price}
                  onChange={(e) => onPricingChange({ ...pricingData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  disabled={pricingData.isFree}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFree"
                checked={pricingData.isFree}
                onChange={(e) => onPricingChange({ ...pricingData, isFree: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isFree" className="text-sm font-medium">Make this course free</label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="emiOption"
              checked={pricingData.emiOption}
              onChange={(e) => onPricingChange({ ...pricingData, emiOption: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="emiOption" className="text-sm font-medium">Enable EMI/Installment option</label>
          </div>

          {pricingData.emiOption && (
            <div>
              <label className="block text-sm font-medium mb-2">EMI Duration (months)</label>
              <Input
                type="number"
                value={pricingData.emiMonths}
                onChange={(e) => onPricingChange({ ...pricingData, emiMonths: parseInt(e.target.value) || 0 })}
                placeholder="6"
                min="1"
                max="24"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Sharing</CardTitle>
          <CardDescription>Configure how revenue is split between instructor and platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Instructor Percentage</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={pricingData.revenueSharing.instructorPercentage}
                  onChange={(e) => onPricingChange({
                    ...pricingData,
                    revenueSharing: {
                      ...pricingData.revenueSharing,
                      instructorPercentage: parseInt(e.target.value) || 0
                    }
                  })}
                  min="0"
                  max="100"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Platform Percentage</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={pricingData.revenueSharing.platformPercentage}
                  onChange={(e) => onPricingChange({
                    ...pricingData,
                    revenueSharing: {
                      ...pricingData.revenueSharing,
                      platformPercentage: parseInt(e.target.value) || 0
                    }
                  })}
                  min="0"
                  max="100"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Processing Fee</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={pricingData.revenueSharing.paymentProcessingFee}
                  onChange={(e) => onPricingChange({
                    ...pricingData,
                    revenueSharing: {
                      ...pricingData.revenueSharing,
                      paymentProcessingFee: parseFloat(e.target.value) || 0
                    }
                  })}
                  min="0"
                  step="0.01"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral Tracking</CardTitle>
          <CardDescription>Set up affiliate and referral programs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="referralEnabled"
              checked={pricingData.referralTracking.enabled}
              onChange={(e) => onPricingChange({
                ...pricingData,
                referralTracking: {
                  ...pricingData.referralTracking,
                  enabled: e.target.checked
                }
              })}
              className="rounded"
            />
            <label htmlFor="referralEnabled" className="text-sm font-medium">Enable referral tracking</label>
          </div>

          {pricingData.referralTracking.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Instructor Affiliate Code</label>
                <Input
                  value={pricingData.referralTracking.instructorAffiliateCode}
                  onChange={(e) => onPricingChange({
                    ...pricingData,
                    referralTracking: {
                      ...pricingData.referralTracking,
                      instructorAffiliateCode: e.target.value
                    }
                  })}
                  placeholder="AFFILIATE123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Commission Percentage</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={pricingData.referralTracking.commissionPercentage}
                    onChange={(e) => onPricingChange({
                      ...pricingData,
                      referralTracking: {
                        ...pricingData.referralTracking,
                        commissionPercentage: parseInt(e.target.value) || 0
                      }
                    })}
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderCoupons = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Discount Coupons</CardTitle>
              <CardDescription>Create and manage discount codes for your courses</CardDescription>
            </div>
            <Button
              onClick={() => setIsAddingCoupon(true)}
              className="bg-[#FF804B] hover:bg-[#FF804B]/90"
            >
              Add Coupon
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingCoupon && (
            <div className="p-4 border border-dashed border-gray-300 rounded-lg space-y-4 mb-6">
              <h4 className="font-semibold">Create New Coupon</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Coupon Code</label>
                  <Input
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    placeholder="SAVE20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as 'PERCENTAGE' | 'FIXED' })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Discount Value</label>
                  <Input
                    type="number"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: parseFloat(e.target.value) || 0 })}
                    placeholder="20"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <Input
                    type="date"
                    value={newCoupon.expiryDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Usage Limit</label>
                  <Input
                    type="number"
                    value={newCoupon.usageLimit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: parseInt(e.target.value) || 0 })}
                    placeholder="100"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addCoupon} className="bg-[#2C4E41] hover:bg-[#2C4E41]/90">
                  Create Coupon
                </Button>
                <Button onClick={() => setIsAddingCoupon(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {pricingData.discountCoupons.map((coupon) => (
              <div key={coupon.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{coupon.code}</span>
                      <Badge className={coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {coupon.discountType === 'PERCENTAGE' 
                        ? `${coupon.discountValue}% off`
                        : `${formatCurrency(coupon.discountValue)} off`
                      }
                    </div>
                    <div className="text-sm text-gray-500">
                      Used {coupon.usedCount}/{coupon.usageLimit || '∞'} times
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleCoupon(coupon.id)}
                    >
                      {coupon.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteCoupon(coupon.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBundles = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Bundles</CardTitle>
              <CardDescription>Create bundles of multiple courses at a discounted price</CardDescription>
            </div>
            <Button
              onClick={() => setIsAddingBundle(true)}
              className="bg-[#FF804B] hover:bg-[#FF804B]/90"
            >
              Add Bundle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingBundle && (
            <div className="p-4 border border-dashed border-gray-300 rounded-lg space-y-4 mb-6">
              <h4 className="font-semibold">Create New Bundle</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bundle Name</label>
                  <Input
                    value={newBundle.name}
                    onChange={(e) => setNewBundle({ ...newBundle, name: e.target.value })}
                    placeholder="Web Development Master Bundle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bundle Price</label>
                  <Input
                    type="number"
                    value={newBundle.bundlePrice}
                    onChange={(e) => setNewBundle({ ...newBundle, bundlePrice: parseFloat(e.target.value) || 0 })}
                    placeholder="199.99"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Discount Percentage</label>
                  <Input
                    type="number"
                    value={newBundle.discountPercentage}
                    onChange={(e) => setNewBundle({ ...newBundle, discountPercentage: parseInt(e.target.value) || 0 })}
                    placeholder="30"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addBundle} className="bg-[#2C4E41] hover:bg-[#2C4E41]/90">
                  Create Bundle
                </Button>
                <Button onClick={() => setIsAddingBundle(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {pricingData.courseBundling.map((bundle) => (
              <div key={bundle.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{bundle.name}</span>
                      <Badge className={bundle.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {bundle.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {bundle.courses.length} courses • {formatCurrency(bundle.bundlePrice)} • {bundle.discountPercentage}% off
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Model</CardTitle>
          <CardDescription>Set up subscription-based access to your courses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="subscriptionEnabled"
              checked={pricingData.subscriptionModel.enabled}
              onChange={(e) => onPricingChange({
                ...pricingData,
                subscriptionModel: {
                  ...pricingData.subscriptionModel,
                  enabled: e.target.checked
                }
              })}
              className="rounded"
            />
            <label htmlFor="subscriptionEnabled" className="text-sm font-medium">Enable subscription model</label>
          </div>

          {pricingData.subscriptionModel.enabled && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Monthly Price</label>
                <Input
                  type="number"
                  value={pricingData.subscriptionModel.monthlyPrice}
                  onChange={(e) => onPricingChange({
                    ...pricingData,
                    subscriptionModel: {
                      ...pricingData.subscriptionModel,
                      monthlyPrice: parseFloat(e.target.value) || 0
                    }
                  })}
                  placeholder="29.99"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Yearly Price</label>
                <Input
                  type="number"
                  value={pricingData.subscriptionModel.yearlyPrice}
                  onChange={(e) => onPricingChange({
                    ...pricingData,
                    subscriptionModel: {
                      ...pricingData.subscriptionModel,
                      yearlyPrice: parseFloat(e.target.value) || 0
                    }
                  })}
                  placeholder="299.99"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Lifetime Price</label>
                <Input
                  type="number"
                  value={pricingData.subscriptionModel.lifetimePrice}
                  onChange={(e) => onPricingChange({
                    ...pricingData,
                    subscriptionModel: {
                      ...pricingData.subscriptionModel,
                      lifetimePrice: parseFloat(e.target.value) || 0
                    }
                  })}
                  placeholder="999.99"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderPromotions = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Promotions & Sales</CardTitle>
              <CardDescription>Create time-limited promotions and sales campaigns</CardDescription>
            </div>
            <Button
              onClick={() => setIsAddingPromotion(true)}
              className="bg-[#FF804B] hover:bg-[#FF804B]/90"
            >
              Add Promotion
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingPromotion && (
            <div className="p-4 border border-dashed border-gray-300 rounded-lg space-y-4 mb-6">
              <h4 className="font-semibold">Create New Promotion</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Promotion Name</label>
                  <Input
                    value={newPromotion.name}
                    onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                    placeholder="Black Friday Sale"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Promotion Type</label>
                  <select
                    value={newPromotion.type}
                    onChange={(e) => setNewPromotion({ ...newPromotion, type: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="SALE">Regular Sale</option>
                    <option value="FLASH_SALE">Flash Sale</option>
                    <option value="EARLY_BIRD">Early Bird</option>
                    <option value="BULK_DISCOUNT">Bulk Discount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Discount Percentage</label>
                  <Input
                    type="number"
                    value={newPromotion.discountPercentage}
                    onChange={(e) => setNewPromotion({ ...newPromotion, discountPercentage: parseInt(e.target.value) || 0 })}
                    placeholder="30"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <Input
                    type="datetime-local"
                    value={newPromotion.startDate}
                    onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <Input
                    type="datetime-local"
                    value={newPromotion.endDate}
                    onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addPromotion} className="bg-[#2C4E41] hover:bg-[#2C4E41]/90">
                  Create Promotion
                </Button>
                <Button onClick={() => setIsAddingPromotion(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {pricingData.promotions.map((promotion) => (
              <div key={promotion.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{promotion.name}</span>
                      <Badge className={promotion.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {promotion.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{promotion.type.replace('_', ' ')}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {promotion.discountPercentage}% off • {promotion.startDate} to {promotion.endDate}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'basic', label: 'Basic Pricing', icon: '💰' },
          { id: 'coupons', label: 'Coupons', icon: '🎫' },
          { id: 'bundles', label: 'Bundles', icon: '📦' },
          { id: 'subscriptions', label: 'Subscriptions', icon: '🔄' },
          { id: 'promotions', label: 'Promotions', icon: '🎉' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-[#FF804B] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'basic' && renderBasicPricing()}
      {activeTab === 'coupons' && renderCoupons()}
      {activeTab === 'bundles' && renderBundles()}
      {activeTab === 'subscriptions' && renderSubscriptions()}
      {activeTab === 'promotions' && renderPromotions()}
    </div>
  );
};

export default PricingManager;
