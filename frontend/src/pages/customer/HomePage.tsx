import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Wifi, Coffee, Car, CalendarDays } from 'lucide-react';
import { HotelHeroIllustration, RoomImageSingle, RoomImageDouble, RoomImageSuite } from '@/components/images/RoomTypeImages';

const features = [
  { icon: Star, title: '高品质客房', desc: '精心设计的舒适空间，为您带来宾至如归的感受' },
  { icon: Wifi, title: '免费WiFi', desc: '全覆盖高速无线网络，随时保持连接' },
  { icon: Coffee, title: '精致餐饮', desc: '中西合璧的早餐与特色料理，满足您的味蕾' },
  { icon: Car, title: '免费停车', desc: '宽敞安全的停车场，出行无忧' },
];

const roomShowcase = [
  { Image: RoomImageSingle, name: '单人间', price: '¥299', desc: '简约舒适，商务出行首选' },
  { Image: RoomImageDouble, name: '双人间', price: '¥399', desc: '宽敞温馨，双人同住更惬意' },
  { Image: RoomImageSuite, name: '套房', price: '¥699', desc: '奢华空间，尽享尊贵体验' },
];

export default function HomePage() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!checkIn || !checkOut) return;
    navigate(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}`);
  };

  return (
    <div>
      <section className="relative text-white overflow-hidden">
        <div className="absolute inset-0">
          <HotelHeroIllustration className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"></div>
        </div>
        <div className="relative py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4 tracking-tight">精品酒店</h1>
            <p className="text-xl text-gray-300 mb-10 font-light">舒适客房，贴心服务，让每一次入住都成为美好回忆</p>
            <Card className="max-w-lg mx-auto bg-white/95 backdrop-blur rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkIn" className="text-gray-700 font-medium">入住日期</Label>
                    <Input type="date" id="checkIn" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkOut" className="text-gray-700 font-medium">退房日期</Label>
                    <Input type="date" id="checkOut" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="h-11 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white" />
                  </div>
                </div>
                <Button size="lg" className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white active:scale-[0.98] transition-all" onClick={handleSearch}>
                  <CalendarDays className="w-5 h-5 mr-2" />
                  搜索可用房间
                </Button>
                <button className="w-full mt-3 text-gray-600 hover:text-gray-900 text-sm font-medium" onClick={() => navigate('/rooms')}>
                  查看全部房型 →
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-150 border-gray-100">
              <CardContent className="pt-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Icon className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-center text-gray-900">客房一览</h2>
        <p className="text-gray-500 text-center mb-10">从高品质单人间到豪华套房，满足不同需求</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roomShowcase.map(({ Image, name, price, desc }) => (
            <Card key={name} className="rounded-2xl shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-150 cursor-pointer group" onClick={() => navigate('/rooms')}>
              <div className="h-48 overflow-hidden">
                <Image className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-bold">{name}</h3>
                  <span className="text-lg font-bold text-amber-600">{price}<span className="text-sm font-normal text-gray-500">/晚</span></span>
                </div>
                <p className="text-sm text-gray-500">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}