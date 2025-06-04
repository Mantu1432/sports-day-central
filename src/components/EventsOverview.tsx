
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Trophy, Clock, Target } from 'lucide-react';

const EventsOverview = ({ events, registrations }) => {
  const getEventRegistrations = (eventId) => {
    return registrations.filter(reg => reg.eventId === eventId);
  };

  const getEventStats = (event) => {
    const eventRegistrations = getEventRegistrations(event.id);
    const registrationCount = eventRegistrations.length;
    const fillPercentage = (registrationCount / event.maxParticipants) * 100;
    
    return {
      registrationCount,
      fillPercentage,
      spotsRemaining: event.maxParticipants - registrationCount,
      isFull: registrationCount >= event.maxParticipants
    };
  };

  const categorizeEvents = () => {
    const categories = {};
    events.forEach(event => {
      if (!categories[event.category]) {
        categories[event.category] = [];
      }
      categories[event.category].push(event);
    });
    return categories;
  };

  const categorizedEvents = categorizeEvents();
  const totalRegistrations = registrations.length;
  const totalCapacity = events.reduce((sum, event) => sum + event.maxParticipants, 0);
  const overallFillPercentage = (totalRegistrations / totalCapacity) * 100;

  const getCategoryColor = (category) => {
    const colors = {
      'Track & Field': 'bg-gradient-to-r from-blue-500 to-blue-600',
      'Team Sports': 'bg-gradient-to-r from-green-500 to-green-600',
      'Individual Sports': 'bg-gradient-to-r from-purple-500 to-purple-600',
      'Indoor Games': 'bg-gradient-to-r from-orange-500 to-orange-600'
    };
    return colors[category] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Events Overview
        </h2>
        <p className="text-gray-600">Annual School Sports Championship 2024</p>
      </div>

      {/* Overall Stats */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-8 w-8 text-yellow-300" />
              </div>
              <p className="text-2xl font-bold">{events.length}</p>
              <p className="text-indigo-200">Total Events</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-green-300" />
              </div>
              <p className="text-2xl font-bold">{totalRegistrations}</p>
              <p className="text-indigo-200">Total Registrations</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-8 w-8 text-blue-300" />
              </div>
              <p className="text-2xl font-bold">{overallFillPercentage.toFixed(1)}%</p>
              <p className="text-indigo-200">Overall Capacity</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events by Category */}
      {Object.entries(categorizedEvents).map(([category, categoryEvents]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getCategoryColor(category)}`}>
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{category}</h3>
            <Badge variant="outline" className="text-sm">
              {categoryEvents.length} events
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryEvents.map(event => {
              const stats = getEventStats(event);
              const eventRegistrations = getEventRegistrations(event.id);

              return (
                <Card key={event.id} className="hover:shadow-lg transition-shadow border-0 bg-white shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {event.name}
                      </CardTitle>
                      <Badge 
                        variant={stats.isFull ? "destructive" : stats.fillPercentage > 80 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {stats.registrationCount}/{event.maxParticipants}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Event Details */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-green-500" />
                        {event.venue}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-purple-500" />
                        {stats.registrationCount} registered, {stats.spotsRemaining} spots left
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Registration Progress</span>
                        <span className="font-medium">{stats.fillPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            stats.isFull 
                              ? 'bg-gradient-to-r from-red-500 to-red-600' 
                              : stats.fillPercentage > 80 
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                                : 'bg-gradient-to-r from-green-500 to-emerald-500'
                          }`}
                          style={{ width: `${stats.fillPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="pt-2 border-t">
                      {stats.isFull ? (
                        <div className="flex items-center text-red-600 text-sm font-medium">
                          <Clock className="h-4 w-4 mr-2" />
                          Event Full - Registration Closed
                        </div>
                      ) : stats.fillPercentage > 80 ? (
                        <div className="flex items-center text-orange-600 text-sm font-medium">
                          <Clock className="h-4 w-4 mr-2" />
                          Filling Fast - {stats.spotsRemaining} spots left
                        </div>
                      ) : (
                        <div className="flex items-center text-green-600 text-sm font-medium">
                          <Clock className="h-4 w-4 mr-2" />
                          Open for Registration
                        </div>
                      )}
                    </div>

                    {/* Recent Registrations */}
                    {eventRegistrations.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500 mb-2">Recent registrations:</p>
                        <div className="flex flex-wrap gap-1">
                          {eventRegistrations.slice(-3).map((reg, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {reg.studentName}
                            </Badge>
                          ))}
                          {eventRegistrations.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{eventRegistrations.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsOverview;
