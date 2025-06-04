
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, MapPin, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StudentRegistration = ({ events, onRegistration, existingRegistrations }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    email: '',
    phone: '',
    grade: '',
    eventId: '',
    emergencyContact: ''
  });

  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.studentName || !formData.studentId || !formData.email || !formData.eventId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Check if student is already registered for this event
    const alreadyRegistered = existingRegistrations.some(
      reg => reg.studentId === formData.studentId && reg.eventId === parseInt(formData.eventId)
    );

    if (alreadyRegistered) {
      toast({
        title: "Already Registered",
        description: "This student is already registered for the selected event.",
        variant: "destructive",
      });
      return;
    }

    // Check event capacity
    const selectedEvent = events.find(e => e.id === parseInt(formData.eventId));
    const currentRegistrations = existingRegistrations.filter(
      reg => reg.eventId === parseInt(formData.eventId)
    ).length;

    if (currentRegistrations >= selectedEvent.maxParticipants) {
      toast({
        title: "Event Full",
        description: "This event has reached its maximum capacity.",
        variant: "destructive",
      });
      return;
    }

    onRegistration({
      ...formData,
      eventId: parseInt(formData.eventId),
      registrationDate: new Date().toISOString(),
      status: 'confirmed'
    });

    toast({
      title: "Registration Successful!",
      description: `${formData.studentName} has been registered for ${selectedEvent.name}.`,
    });

    // Reset form
    setFormData({
      studentName: '',
      studentId: '',
      email: '',
      phone: '',
      grade: '',
      eventId: '',
      emergencyContact: ''
    });
  };

  const getEventRegistrationCount = (eventId) => {
    return existingRegistrations.filter(reg => reg.eventId === eventId).length;
  };

  const grades = ['9th Grade', '10th Grade', '11th Grade', '12th Grade'];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Student Registration
        </h2>
        <p className="text-gray-600">Register for the Annual School Sports Championship</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Form */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Registration Form
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentName" className="text-sm font-medium text-gray-700">
                    Student Name *
                  </Label>
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                    placeholder="Enter full name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="studentId" className="text-sm font-medium text-gray-700">
                    Student ID *
                  </Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    placeholder="Enter student ID"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="student@school.edu"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grade" className="text-sm font-medium text-gray-700">
                    Grade
                  </Label>
                  <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="eventId" className="text-sm font-medium text-gray-700">
                    Select Event *
                  </Label>
                  <Select value={formData.eventId} onValueChange={(value) => handleInputChange('eventId', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map(event => {
                        const registrationCount = getEventRegistrationCount(event.id);
                        const isFull = registrationCount >= event.maxParticipants;
                        return (
                          <SelectItem 
                            key={event.id} 
                            value={event.id.toString()}
                            disabled={isFull}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{event.name}</span>
                              <span className="text-sm text-gray-500 ml-2">
                                ({registrationCount}/{event.maxParticipants})
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">
                  Emergency Contact
                </Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="Emergency contact number"
                  className="mt-1"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3"
              >
                Register for Event
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Available Events */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Available Events
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {events.map(event => {
                const registrationCount = getEventRegistrationCount(event.id);
                const isFull = registrationCount >= event.maxParticipants;
                const fillPercentage = (registrationCount / event.maxParticipants) * 100;

                return (
                  <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{event.name}</h3>
                        <Badge variant="secondary" className="mb-2">
                          {event.category}
                        </Badge>
                      </div>
                      <Badge 
                        variant={isFull ? "destructive" : fillPercentage > 80 ? "default" : "secondary"}
                      >
                        {registrationCount}/{event.maxParticipants}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.venue}
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            isFull 
                              ? 'bg-red-500' 
                              : fillPercentage > 80 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${fillPercentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {isFull ? 'Event Full' : `${event.maxParticipants - registrationCount} spots remaining`}
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
