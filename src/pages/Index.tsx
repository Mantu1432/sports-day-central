
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Trophy, FileText, Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudentRegistration from '@/components/StudentRegistration';
import EventsOverview from '@/components/EventsOverview';
import ReportsPanel from '@/components/ReportsPanel';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([
    {
      id: 1,
      name: '100m Sprint',
      category: 'Track & Field',
      maxParticipants: 20,
      date: '2024-03-15',
      venue: 'Athletic Track'
    },
    {
      id: 2,
      name: 'Football',
      category: 'Team Sports',
      maxParticipants: 22,
      date: '2024-03-16',
      venue: 'Football Ground'
    },
    {
      id: 3,
      name: 'Basketball',
      category: 'Team Sports',
      maxParticipants: 10,
      date: '2024-03-17',
      venue: 'Basketball Court'
    },
    {
      id: 4,
      name: 'Swimming',
      category: 'Individual Sports',
      maxParticipants: 15,
      date: '2024-03-18',
      venue: 'Swimming Pool'
    },
    {
      id: 5,
      name: 'Long Jump',
      category: 'Track & Field',
      maxParticipants: 18,
      date: '2024-03-19',
      venue: 'Athletic Field'
    },
    {
      id: 6,
      name: 'Chess',
      category: 'Indoor Games',
      maxParticipants: 32,
      date: '2024-03-20',
      venue: 'Activity Hall'
    }
  ]);

  useEffect(() => {
    const savedRegistrations = localStorage.getItem('sportsRegistrations');
    if (savedRegistrations) {
      setRegistrations(JSON.parse(savedRegistrations));
    }
  }, []);

  const handleRegistration = (newRegistration) => {
    const updatedRegistrations = [...registrations, { ...newRegistration, id: Date.now() }];
    setRegistrations(updatedRegistrations);
    localStorage.setItem('sportsRegistrations', JSON.stringify(updatedRegistrations));
  };

  const getEventStats = () => {
    const totalEvents = events.length;
    const totalRegistrations = registrations.length;
    const uniqueStudents = new Set(registrations.map(r => r.studentId)).size;
    const categories = [...new Set(events.map(e => e.category))].length;

    return { totalEvents, totalRegistrations, uniqueStudents, categories };
  };

  const stats = getEventStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Sports Event Manager
                </h1>
                <p className="text-gray-600">Annual School Sports Championship 2024</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => setActiveTab('register')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Register Student
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Events</p>
                  <p className="text-3xl font-bold">{stats.totalEvents}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Registrations</p>
                  <p className="text-3xl font-bold">{stats.totalRegistrations}</p>
                </div>
                <Users className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Participants</p>
                  <p className="text-3xl font-bold">{stats.uniqueStudents}</p>
                </div>
                <Trophy className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Categories</p>
                  <p className="text-3xl font-bold">{stats.categories}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b bg-gray-50/50 p-1">
                <TabsList className="grid w-full grid-cols-3 bg-transparent">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Events Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Student Registration
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reports"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Reports
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="overview" className="mt-0">
                  <EventsOverview events={events} registrations={registrations} />
                </TabsContent>

                <TabsContent value="register" className="mt-0">
                  <StudentRegistration 
                    events={events} 
                    onRegistration={handleRegistration}
                    existingRegistrations={registrations}
                  />
                </TabsContent>

                <TabsContent value="reports" className="mt-0">
                  <ReportsPanel events={events} registrations={registrations} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
