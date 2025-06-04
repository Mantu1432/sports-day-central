
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Trophy, Calendar, MapPin, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface StudentRegistrationProps {
  events: Event[];
  onRegistration: (registration: Omit<Registration, 'id'>) => void;
  existingRegistrations: Registration[];
}

const StudentRegistration: React.FC<StudentRegistrationProps> = ({ 
  events, 
  onRegistration, 
  existingRegistrations 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    email: '',
    phone: '',
    grade: '',
    eventId: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getEventRegistrations = (eventId: number) => {
    return existingRegistrations.filter(reg => reg.eventId === eventId);
  };

  const isStudentRegisteredForEvent = (studentId: string, eventId: number) => {
    return existingRegistrations.some(reg => 
      reg.studentId === studentId && reg.eventId === eventId
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentName || !formData.studentId || !formData.email || !formData.eventId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const eventId = parseInt(formData.eventId);
    const selectedEvent = events.find(e => e.id === eventId);
    
    if (!selectedEvent) {
      toast({
        title: "Invalid Event",
        description: "Please select a valid event.",
        variant: "destructive"
      });
      return;
    }

    // Check if student is already registered for this event
    if (isStudentRegisteredForEvent(formData.studentId, eventId)) {
      toast({
        title: "Already Registered",
        description: `Student ${formData.studentId} is already registered for ${selectedEvent.name}.`,
        variant: "destructive"
      });
      return;
    }

    // Check if event is full
    const eventRegistrations = getEventRegistrations(eventId);
    if (eventRegistrations.length >= selectedEvent.maxParticipants) {
      toast({
        title: "Event Full",
        description: `${selectedEvent.name} has reached maximum capacity.`,
        variant: "destructive"
      });
      return;
    }

    const newRegistration = {
      ...formData,
      eventId,
      registrationDate: new Date().toISOString()
    };

    onRegistration(newRegistration);

    toast({
      title: "Registration Successful!",
      description: `${formData.studentName} has been registered for ${selectedEvent.name}.`,
      variant: "default"
    });

    // Reset form
    setFormData({
      studentName: '',
      studentId: '',
      email: '',
      phone: '',
      grade: '',
      eventId: ''
    });
  };

  const getEventStatus = (event: Event) => {
    const registrations = getEventRegistrations(event.id);
    const fillPercentage = (registrations.length / event.maxParticipants) * 100;
    
    if (registrations.length >= event.maxParticipants) return { status: 'full', color: 'destructive' };
    if (fillPercentage > 80) return { status: 'filling', color: 'default' };
    return { status: 'open', color: 'secondary' };
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Student Registration
        </h2>
        <p className="text-gray-600">Register students for sports events in the annual championship</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Form */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Registration Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter student ID"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade/Class
                  </label>
                  <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6th">6th Grade</SelectItem>
                      <SelectItem value="7th">7th Grade</SelectItem>
                      <SelectItem value="8th">8th Grade</SelectItem>
                      <SelectItem value="9th">9th Grade</SelectItem>
                      <SelectItem value="10th">10th Grade</SelectItem>
                      <SelectItem value="11th">11th Grade</SelectItem>
                      <SelectItem value="12th">12th Grade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Event *
                </label>
                <Select value={formData.eventId} onValueChange={(value) => handleInputChange('eventId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map(event => {
                      const registrations = getEventRegistrations(event.id);
                      const isFull = registrations.length >= event.maxParticipants;
                      const isRegistered = formData.studentId && isStudentRegisteredForEvent(formData.studentId, event.id);
                      
                      return (
                        <SelectItem 
                          key={event.id} 
                          value={event.id.toString()}
                          disabled={isFull || isRegistered}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{event.name}</span>
                            <span className="text-xs text-gray-500">
                              {registrations.length}/{event.maxParticipants}
                              {isFull && " (Full)"}
                              {isRegistered && " (Registered)"}
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Register Student
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Events List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Available Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {events.map(event => {
                const registrations = getEventRegistrations(event.id);
                const { status, color } = getEventStatus(event);
                const fillPercentage = (registrations.length / event.maxParticipants) * 100;
                
                return (
                  <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{event.name}</h3>
                      <Badge variant={color as any}>
                        {status === 'full' ? 'Full' : status === 'filling' ? 'Filling Fast' : 'Open'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 mr-2" />
                        {event.category}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.venue}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {registrations.length}/{event.maxParticipants} participants
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            status === 'full' ? 'bg-red-500' : 
                            status === 'filling' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {fillPercentage.toFixed(1)}% filled
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentRegistration;
