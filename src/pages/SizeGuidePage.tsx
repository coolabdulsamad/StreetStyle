
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SizeGuidePage = () => {
  return (
    <PageLayout>
      <div className="container max-w-6xl py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Size Guide</CardTitle>
            <p className="text-muted-foreground">
              Find your perfect fit with our comprehensive size guides
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="shoes" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="shoes">Shoes</TabsTrigger>
                <TabsTrigger value="tops">Tops</TabsTrigger>
                <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
                <TabsTrigger value="accessories">Accessories</TabsTrigger>
              </TabsList>

              <TabsContent value="shoes" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Sneaker Sizing</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-3 text-left">US Men</th>
                          <th className="border border-gray-300 p-3 text-left">US Women</th>
                          <th className="border border-gray-300 p-3 text-left">UK</th>
                          <th className="border border-gray-300 p-3 text-left">EU</th>
                          <th className="border border-gray-300 p-3 text-left">CM</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="border border-gray-300 p-3">6</td><td className="border border-gray-300 p-3">7.5</td><td className="border border-gray-300 p-3">5.5</td><td className="border border-gray-300 p-3">39</td><td className="border border-gray-300 p-3">24</td></tr>
                        <tr><td className="border border-gray-300 p-3">6.5</td><td className="border border-gray-300 p-3">8</td><td className="border border-gray-300 p-3">6</td><td className="border border-gray-300 p-3">39.5</td><td className="border border-gray-300 p-3">24.5</td></tr>
                        <tr><td className="border border-gray-300 p-3">7</td><td className="border border-gray-300 p-3">8.5</td><td className="border border-gray-300 p-3">6.5</td><td className="border border-gray-300 p-3">40</td><td className="border border-gray-300 p-3">25</td></tr>
                        <tr><td className="border border-gray-300 p-3">7.5</td><td className="border border-gray-300 p-3">9</td><td className="border border-gray-300 p-3">7</td><td className="border border-gray-300 p-3">40.5</td><td className="border border-gray-300 p-3">25.5</td></tr>
                        <tr><td className="border border-gray-300 p-3">8</td><td className="border border-gray-300 p-3">9.5</td><td className="border border-gray-300 p-3">7.5</td><td className="border border-gray-300 p-3">41</td><td className="border border-gray-300 p-3">26</td></tr>
                        <tr><td className="border border-gray-300 p-3">8.5</td><td className="border border-gray-300 p-3">10</td><td className="border border-gray-300 p-3">8</td><td className="border border-gray-300 p-3">42</td><td className="border border-gray-300 p-3">26.5</td></tr>
                        <tr><td className="border border-gray-300 p-3">9</td><td className="border border-gray-300 p-3">10.5</td><td className="border border-gray-300 p-3">8.5</td><td className="border border-gray-300 p-3">42.5</td><td className="border border-gray-300 p-3">27</td></tr>
                        <tr><td className="border border-gray-300 p-3">9.5</td><td className="border border-gray-300 p-3">11</td><td className="border border-gray-300 p-3">9</td><td className="border border-gray-300 p-3">43</td><td className="border border-gray-300 p-3">27.5</td></tr>
                        <tr><td className="border border-gray-300 p-3">10</td><td className="border border-gray-300 p-3">11.5</td><td className="border border-gray-300 p-3">9.5</td><td className="border border-gray-300 p-3">44</td><td className="border border-gray-300 p-3">28</td></tr>
                        <tr><td className="border border-gray-300 p-3">10.5</td><td className="border border-gray-300 p-3">12</td><td className="border border-gray-300 p-3">10</td><td className="border border-gray-300 p-3">44.5</td><td className="border border-gray-300 p-3">28.5</td></tr>
                        <tr><td className="border border-gray-300 p-3">11</td><td className="border border-gray-300 p-3">12.5</td><td className="border border-gray-300 p-3">10.5</td><td className="border border-gray-300 p-3">45</td><td className="border border-gray-300 p-3">29</td></tr>
                        <tr><td className="border border-gray-300 p-3">11.5</td><td className="border border-gray-300 p-3">13</td><td className="border border-gray-300 p-3">11</td><td className="border border-gray-300 p-3">45.5</td><td className="border border-gray-300 p-3">29.5</td></tr>
                        <tr><td className="border border-gray-300 p-3">12</td><td className="border border-gray-300 p-3">13.5</td><td className="border border-gray-300 p-3">11.5</td><td className="border border-gray-300 p-3">46</td><td className="border border-gray-300 p-3">30</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tops" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Tops & Hoodies</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-3 text-left">Size</th>
                          <th className="border border-gray-300 p-3 text-left">Chest (inches)</th>
                          <th className="border border-gray-300 p-3 text-left">Chest (cm)</th>
                          <th className="border border-gray-300 p-3 text-left">Length (inches)</th>
                          <th className="border border-gray-300 p-3 text-left">Length (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="border border-gray-300 p-3">XS</td><td className="border border-gray-300 p-3">32-34</td><td className="border border-gray-300 p-3">81-86</td><td className="border border-gray-300 p-3">26</td><td className="border border-gray-300 p-3">66</td></tr>
                        <tr><td className="border border-gray-300 p-3">S</td><td className="border border-gray-300 p-3">34-36</td><td className="border border-gray-300 p-3">86-91</td><td className="border border-gray-300 p-3">27</td><td className="border border-gray-300 p-3">69</td></tr>
                        <tr><td className="border border-gray-300 p-3">M</td><td className="border border-gray-300 p-3">36-38</td><td className="border border-gray-300 p-3">91-97</td><td className="border border-gray-300 p-3">28</td><td className="border border-gray-300 p-3">71</td></tr>
                        <tr><td className="border border-gray-300 p-3">L</td><td className="border border-gray-300 p-3">38-40</td><td className="border border-gray-300 p-3">97-102</td><td className="border border-gray-300 p-3">29</td><td className="border border-gray-300 p-3">74</td></tr>
                        <tr><td className="border border-gray-300 p-3">XL</td><td className="border border-gray-300 p-3">40-42</td><td className="border border-gray-300 p-3">102-107</td><td className="border border-gray-300 p-3">30</td><td className="border border-gray-300 p-3">76</td></tr>
                        <tr><td className="border border-gray-300 p-3">XXL</td><td className="border border-gray-300 p-3">42-44</td><td className="border border-gray-300 p-3">107-112</td><td className="border border-gray-300 p-3">31</td><td className="border border-gray-300 p-3">79</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bottoms" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Pants & Shorts</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-3 text-left">Size</th>
                          <th className="border border-gray-300 p-3 text-left">Waist (inches)</th>
                          <th className="border border-gray-300 p-3 text-left">Waist (cm)</th>
                          <th className="border border-gray-300 p-3 text-left">Inseam (inches)</th>
                          <th className="border border-gray-300 p-3 text-left">Inseam (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="border border-gray-300 p-3">28</td><td className="border border-gray-300 p-3">28</td><td className="border border-gray-300 p-3">71</td><td className="border border-gray-300 p-3">32</td><td className="border border-gray-300 p-3">81</td></tr>
                        <tr><td className="border border-gray-300 p-3">30</td><td className="border border-gray-300 p-3">30</td><td className="border border-gray-300 p-3">76</td><td className="border border-gray-300 p-3">32</td><td className="border border-gray-300 p-3">81</td></tr>
                        <tr><td className="border border-gray-300 p-3">32</td><td className="border border-gray-300 p-3">32</td><td className="border border-gray-300 p-3">81</td><td className="border border-gray-300 p-3">32</td><td className="border border-gray-300 p-3">81</td></tr>
                        <tr><td className="border border-gray-300 p-3">34</td><td className="border border-gray-300 p-3">34</td><td className="border border-gray-300 p-3">86</td><td className="border border-gray-300 p-3">32</td><td className="border border-gray-300 p-3">81</td></tr>
                        <tr><td className="border border-gray-300 p-3">36</td><td className="border border-gray-300 p-3">36</td><td className="border border-gray-300 p-3">91</td><td className="border border-gray-300 p-3">32</td><td className="border border-gray-300 p-3">81</td></tr>
                        <tr><td className="border border-gray-300 p-3">38</td><td className="border border-gray-300 p-3">38</td><td className="border border-gray-300 p-3">97</td><td className="border border-gray-300 p-3">32</td><td className="border border-gray-300 p-3">81</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="accessories" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Hats & Accessories</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Hat Sizes</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 p-3 text-left">Size</th>
                              <th className="border border-gray-300 p-3 text-left">Head Circumference (inches)</th>
                              <th className="border border-gray-300 p-3 text-left">Head Circumference (cm)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td className="border border-gray-300 p-3">S/M</td><td className="border border-gray-300 p-3">21.5-22.5</td><td className="border border-gray-300 p-3">54.5-57</td></tr>
                            <tr><td className="border border-gray-300 p-3">L/XL</td><td className="border border-gray-300 p-3">22.5-23.5</td><td className="border border-gray-300 p-3">57-59.5</td></tr>
                            <tr><td className="border border-gray-300 p-3">One Size</td><td className="border border-gray-300 p-3">22-23</td><td className="border border-gray-300 p-3">56-58</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">How to Measure</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><strong>Chest:</strong> Measure around the fullest part of your chest</li>
                <li><strong>Waist:</strong> Measure around your natural waistline</li>
                <li><strong>Inseam:</strong> Measure from the crotch to the bottom of the leg</li>
                <li><strong>Head:</strong> Measure around the largest part of your head</li>
                <li><strong>Foot:</strong> Measure from heel to toe while standing</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default SizeGuidePage;
