
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Trophy } from 'lucide-react';

interface Event {
  id: number;
  name: string;
  category: string;
  maxParticipants: number;
  date: string;
  venue: string;
}

interface Registration {
  id: number;
  studentName: string;
  studentId: string;
  eventId: number;
  email: string;
  phone?: string;
  grade?: string;
  registrationDate: string;
}

interface EventsOverviewProps {
  events: Event[];
  registrations: Registration[];
}

const EventsOverview: React.FC<EventsOverviewProps> = ({ events, registrations }) => {
  const getEventRegistrations = (eventId: number) => {
    return registrations.filter(reg => reg.eventId === eventId);
  };

  const getEventStatus = (event: Event) => {
    const eventRegs = getEventRegistrations(event.id);
    const fillPercentage = (eventRegs.length / event.maxParticipants) * 100;
    
    if (eventRegs.length >= event.maxParticipants) return 'full';
    if (fillPercentage > 80) return 'filling';
    return 'open';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'full': return 'destructive';
      case 'filling': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'full': return 'Full';
      case 'filling': return 'Filling Fast';
      default: return 'Open';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Events Overview
        </h2>
        <p className="text-gray-600">Browse and track all sports events and their registration status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => {
          const eventRegistrations = getEventRegistrations(event.id);
          const status = getEventStatus(event);
          const fillPercentage = (eventRegistrations.length / event.maxParticipants) * 100;

          return (
            <Card key={event.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-gray-800">{event.name}</CardTitle>
                  <Badge variant={getStatusColor(status) as any}>
                    {getStatusText(status)}
                  </Badge>
                </div>
                <Badge variant="outline" className="w-fit">
                  {event.category}
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.venue}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Registrations
                    </span>
                    <span className="font-medium">
                      {eventRegistrations.length}/{event.maxParticipants}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        status === 'full' ? 'bg-red-500' : 
                        status === 'filling' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                    />
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center">
                    {fillPercentage.toFixed(1)}% filled
                  </p>
                </div>

                {eventRegistrations.length > 0 && (
                  <div className="pt-2 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Registrations:</h4>
                    <div className="space-y-1">
                      {eventRegistrations.slice(0, 3).map(reg => (
                        <div key={reg.id} className="text-xs text-gray-600 flex justify-between">
                          <span>{reg.studentName}</span>
                          <span>{reg.studentId}</span>
                        </div>
                      ))}
                      {eventRegistrations.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{eventRegistrations.length - 3} more students
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Available</h3>
          <p className="text-gray-500">Events will appear here once they are added to the system.</p>
        </div>
      )}
    </div>
  );
};

export default EventsOverview;
