
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SizeGuideModalProps {
  productType: 'footwear' | 'clothing' | 'accessories';
}

const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ productType }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-sm p-0 h-auto font-medium underline">Size Guide</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Size Guide</DialogTitle>
          <DialogDescription>
            Find your perfect fit with our comprehensive size charts
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={productType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="footwear">Footwear</TabsTrigger>
            <TabsTrigger value="clothing">Clothing</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="footwear" className="pt-4">
            <div className="space-y-4">
              <h3 className="font-medium">How to Measure</h3>
              <p className="text-muted-foreground">
                Stand on a level floor with your heel against the wall. 
                Measure from the wall to the tip of your longest toe.
              </p>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>US</TableHead>
                      <TableHead>EU</TableHead>
                      <TableHead>UK</TableHead>
                      <TableHead>CM</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>6</TableCell>
                      <TableCell>39</TableCell>
                      <TableCell>5.5</TableCell>
                      <TableCell>24</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>7</TableCell>
                      <TableCell>40</TableCell>
                      <TableCell>6.5</TableCell>
                      <TableCell>25</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>8</TableCell>
                      <TableCell>41</TableCell>
                      <TableCell>7.5</TableCell>
                      <TableCell>26</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>9</TableCell>
                      <TableCell>42</TableCell>
                      <TableCell>8.5</TableCell>
                      <TableCell>27</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>10</TableCell>
                      <TableCell>43</TableCell>
                      <TableCell>9.5</TableCell>
                      <TableCell>28</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>11</TableCell>
                      <TableCell>44</TableCell>
                      <TableCell>10.5</TableCell>
                      <TableCell>29</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>12</TableCell>
                      <TableCell>45</TableCell>
                      <TableCell>11.5</TableCell>
                      <TableCell>30</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="clothing" className="pt-4">
            <div className="space-y-4">
              <h3 className="font-medium">How to Measure</h3>
              <p className="text-muted-foreground">
                For tops, measure around the fullest part of your chest and for bottoms, 
                measure around your natural waistline.
              </p>
              
              <div className="overflow-x-auto">
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
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="accessories" className="pt-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Most accessories are one-size-fits-all. For specific items like hats or gloves, 
                please refer to the individual product description for sizing information.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuideModal;
