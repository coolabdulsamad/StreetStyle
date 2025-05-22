
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SizeGuideProps {
  productType: 'sneakers' | 'apparel';
  trigger?: React.ReactNode;
}

const SizeGuide: React.FC<SizeGuideProps> = ({ productType, trigger }) => {
  const defaultTrigger = (
    <Button variant="link" className="h-auto p-0 text-sm underline">
      Size Guide
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
          <DialogDescription>
            Find your perfect fit with our comprehensive size guide.
          </DialogDescription>
        </DialogHeader>

        {productType === 'sneakers' ? (
          <SneakersSizeGuide />
        ) : (
          <ApparelSizeGuide />
        )}
      </DialogContent>
    </Dialog>
  );
};

const SneakersSizeGuide = () => {
  return (
    <div className="my-4">
      <p className="mb-4 text-sm text-muted-foreground">
        Shoe sizes can vary between brands. If you're between sizes, we recommend sizing up.
        Measure your foot length in the evening when feet are at their largest.
      </p>
      
      <Tabs defaultValue="mens">
        <TabsList className="mb-4">
          <TabsTrigger value="mens">Men's Sizes</TabsTrigger>
          <TabsTrigger value="womens">Women's Sizes</TabsTrigger>
          <TabsTrigger value="kids">Kids' Sizes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mens">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>US</TableHead>
                <TableHead>UK</TableHead>
                <TableHead>EU</TableHead>
                <TableHead>CM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>7</TableCell>
                <TableCell>6</TableCell>
                <TableCell>40</TableCell>
                <TableCell>25</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>8</TableCell>
                <TableCell>7</TableCell>
                <TableCell>41</TableCell>
                <TableCell>26</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>9</TableCell>
                <TableCell>8</TableCell>
                <TableCell>42</TableCell>
                <TableCell>27</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>10</TableCell>
                <TableCell>9</TableCell>
                <TableCell>43</TableCell>
                <TableCell>28</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>11</TableCell>
                <TableCell>10</TableCell>
                <TableCell>44</TableCell>
                <TableCell>29</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>12</TableCell>
                <TableCell>11</TableCell>
                <TableCell>45</TableCell>
                <TableCell>30</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>13</TableCell>
                <TableCell>12</TableCell>
                <TableCell>46</TableCell>
                <TableCell>31</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="womens">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>US</TableHead>
                <TableHead>UK</TableHead>
                <TableHead>EU</TableHead>
                <TableHead>CM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>5</TableCell>
                <TableCell>3</TableCell>
                <TableCell>36</TableCell>
                <TableCell>22</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>6</TableCell>
                <TableCell>4</TableCell>
                <TableCell>37</TableCell>
                <TableCell>23</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>7</TableCell>
                <TableCell>5</TableCell>
                <TableCell>38</TableCell>
                <TableCell>24</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>8</TableCell>
                <TableCell>6</TableCell>
                <TableCell>39</TableCell>
                <TableCell>25</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>9</TableCell>
                <TableCell>7</TableCell>
                <TableCell>40</TableCell>
                <TableCell>26</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>10</TableCell>
                <TableCell>8</TableCell>
                <TableCell>41</TableCell>
                <TableCell>27</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>11</TableCell>
                <TableCell>9</TableCell>
                <TableCell>42</TableCell>
                <TableCell>28</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="kids">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>US</TableHead>
                <TableHead>UK</TableHead>
                <TableHead>EU</TableHead>
                <TableHead>CM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>3.5Y</TableCell>
                <TableCell>3</TableCell>
                <TableCell>35</TableCell>
                <TableCell>21.5</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4Y</TableCell>
                <TableCell>3.5</TableCell>
                <TableCell>36</TableCell>
                <TableCell>22</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4.5Y</TableCell>
                <TableCell>4</TableCell>
                <TableCell>36.5</TableCell>
                <TableCell>22.5</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5Y</TableCell>
                <TableCell>4.5</TableCell>
                <TableCell>37.5</TableCell>
                <TableCell>23</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5.5Y</TableCell>
                <TableCell>5</TableCell>
                <TableCell>38</TableCell>
                <TableCell>23.5</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>6Y</TableCell>
                <TableCell>5.5</TableCell>
                <TableCell>38.5</TableCell>
                <TableCell>24</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <h4 className="font-medium mb-2">How to Measure</h4>
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          <li>Place your foot on a flat piece of paper against a wall.</li>
          <li>Mark the longest part of your foot (from heel to longest toe).</li>
          <li>Measure the distance in centimeters.</li>
          <li>Find your size in the chart above based on the measurement.</li>
        </ol>
      </div>
    </div>
  );
};

const ApparelSizeGuide = () => {
  return (
    <div className="my-4">
      <p className="mb-4 text-sm text-muted-foreground">
        Our apparel is designed with a modern, streetwear fit. If you prefer a looser fit, we recommend sizing up.
        For a more fitted look, choose your regular size.
      </p>
      
      <Tabs defaultValue="mens">
        <TabsList className="mb-4">
          <TabsTrigger value="mens">Men's Sizes</TabsTrigger>
          <TabsTrigger value="womens">Women's Sizes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mens">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Size</TableHead>
                <TableHead>Chest (in)</TableHead>
                <TableHead>Waist (in)</TableHead>
                <TableHead>Hip (in)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>XS</TableCell>
                <TableCell>34-36</TableCell>
                <TableCell>28-30</TableCell>
                <TableCell>34-36</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>S</TableCell>
                <TableCell>36-38</TableCell>
                <TableCell>30-32</TableCell>
                <TableCell>36-38</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>M</TableCell>
                <TableCell>38-40</TableCell>
                <TableCell>32-34</TableCell>
                <TableCell>38-40</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>L</TableCell>
                <TableCell>40-42</TableCell>
                <TableCell>34-36</TableCell>
                <TableCell>40-42</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>XL</TableCell>
                <TableCell>42-44</TableCell>
                <TableCell>36-38</TableCell>
                <TableCell>42-44</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>XXL</TableCell>
                <TableCell>44-46</TableCell>
                <TableCell>38-40</TableCell>
                <TableCell>44-46</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="womens">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Size</TableHead>
                <TableHead>Chest (in)</TableHead>
                <TableHead>Waist (in)</TableHead>
                <TableHead>Hip (in)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>XS</TableCell>
                <TableCell>32-34</TableCell>
                <TableCell>25-27</TableCell>
                <TableCell>35-37</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>S</TableCell>
                <TableCell>34-36</TableCell>
                <TableCell>27-29</TableCell>
                <TableCell>37-39</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>M</TableCell>
                <TableCell>36-38</TableCell>
                <TableCell>29-31</TableCell>
                <TableCell>39-41</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>L</TableCell>
                <TableCell>38-40</TableCell>
                <TableCell>31-33</TableCell>
                <TableCell>41-43</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>XL</TableCell>
                <TableCell>40-42</TableCell>
                <TableCell>33-35</TableCell>
                <TableCell>43-45</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <h4 className="font-medium mb-2">How to Measure</h4>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
          <li><strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.</li>
          <li><strong>Hip:</strong> Measure around the fullest part of your hips, keeping the tape horizontal.</li>
        </ul>
      </div>
    </div>
  );
};

export default SizeGuide;
