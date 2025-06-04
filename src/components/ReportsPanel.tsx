import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  BarChart3, 
  PieChart, 
  Users, 
  Trophy, 
  Calendar,
  TrendingUp,
  Filter,
  Printer
} from 'lucide-react';

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

interface ReportsPanelProps {
  events: Event[];
  registrations: Registration[];
}

const ReportsPanel: React.FC<ReportsPanelProps> = ({ events, registrations }) => {
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter registrations based on selections
  const getFilteredRegistrations = () => {
    let filtered = registrations;
    
    if (selectedEvent !== 'all') {
      filtered = filtered.filter(reg => reg.eventId === parseInt(selectedEvent));
    }
    
    if (selectedCategory !== 'all') {
      const categoryEvents = events.filter(event => event.category === selectedCategory).map(e => e.id);
      filtered = filtered.filter(reg => categoryEvents.includes(reg.eventId));
    }
    
    return filtered;
  };

  const filteredRegistrations = getFilteredRegistrations();

  // Generate comprehensive statistics
  const getStatistics = () => {
    const totalStudents = new Set(registrations.map(r => r.studentId)).size;
    const totalRegistrations = registrations.length;
    const categories = [...new Set(events.map(e => e.category))];
    
    // Event-wise statistics
    const eventStats = events.map(event => {
      const eventRegs = registrations.filter(r => r.eventId === event.id);
      return {
        ...event,
        registrations: eventRegs.length,
        fillPercentage: (eventRegs.length / event.maxParticipants) * 100,
        students: eventRegs
      };
    });

    // Category-wise statistics
    const categoryStats = categories.map(category => {
      const categoryEvents = events.filter(e => e.category === category);
      const categoryRegs = registrations.filter(r => 
        categoryEvents.some(e => e.id === r.eventId)
      );
      const totalCapacity = categoryEvents.reduce((sum, e) => sum + e.maxParticipants, 0);
      
      return {
        category,
        events: categoryEvents.length,
        registrations: categoryRegs.length,
        capacity: totalCapacity,
        fillPercentage: totalCapacity > 0 ? (categoryRegs.length / totalCapacity) * 100 : 0
      };
    });

    // Grade-wise statistics
    const gradeStats: Record<string, number> = {};
    registrations.forEach(reg => {
      if (reg.grade) {
        gradeStats[reg.grade] = (gradeStats[reg.grade] || 0) + 1;
      }
    });

    return {
      totalStudents,
      totalRegistrations,
      eventStats: eventStats.sort((a, b) => b.registrations - a.registrations),
      categoryStats: categoryStats.sort((a, b) => b.registrations - a.registrations),
      gradeStats,
      averageRegistrationsPerEvent: totalRegistrations / (events.length || 1),
      mostPopularEvent: eventStats.reduce((max, event) => 
        event.registrations > max.registrations ? event : max, eventStats[0] || { name: 'N/A', registrations: 0 }
      )
    };
  };

  const stats = getStatistics();

  // Export functionality
  const exportToCSV = (data: string, filename: string) => {
    const csvContent = "data:text/csv;charset=utf-8," + data;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportEventReport = () => {
    const headers = "Event Name,Category,Date,Venue,Registrations,Capacity,Fill Percentage\n";
    const data = stats.eventStats.map(event => 
      `"${event.name}","${event.category}","${event.date}","${event.venue}",${event.registrations},${event.maxParticipants},${event.fillPercentage.toFixed(2)}%`
    ).join('\n');
    
    exportToCSV(headers + data, 'event_report.csv');
  };

  const exportStudentReport = () => {
    const headers = "Student Name,Student ID,Email,Phone,Grade,Event,Category,Registration Date\n";
    const data = filteredRegistrations.map(reg => {
      const event = events.find(e => e.id === reg.eventId);
      return `"${reg.studentName}","${reg.studentId}","${reg.email}","${reg.phone || ''}","${reg.grade || ''}","${event?.name || ''}","${event?.category || ''}","${new Date(reg.registrationDate).toLocaleDateString()}"`;
    }).join('\n');
    
    exportToCSV(headers + data, 'student_report.csv');
  };

  // Print functionality
  const printEventParticipants = (eventId?: number) => {
    const eventsToPrint = eventId ? [events.find(e => e.id === eventId)!] : events;
    
    const printContent = eventsToPrint.map(event => {
      const eventRegistrations = registrations.filter(r => r.eventId === event.id);
      
      return `
        <div style="page-break-after: always; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">School Annual Sports Championship 2024</h1>
            <h2 style="color: #1f2937; margin-bottom: 5px;">${event.name} - Participants List</h2>
            <p style="color: #6b7280; margin: 0;">Category: ${event.category} | Date: ${new Date(event.date).toLocaleDateString()} | Venue: ${event.venue}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p><strong>Total Participants:</strong> ${eventRegistrations.length}/${event.maxParticipants}</p>
            <p><strong>Event Status:</strong> ${eventRegistrations.length >= event.maxParticipants ? 'Full' : 'Open'}</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">S.No.</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Student Name</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Student ID</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Grade</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Email</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Phone</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Registration Date</th>
              </tr>
            </thead>
            <tbody>
              ${eventRegistrations.map((reg, index) => `
                <tr>
                  <td style="border: 1px solid #d1d5db; padding: 10px;">${index + 1}</td>
                  <td style="border: 1px solid #d1d5db; padding: 10px;">${reg.studentName}</td>
                  <td style="border: 1px solid #d1d5db; padding: 10px;">${reg.studentId}</td>
                  <td style="border: 1px solid #d1d5db; padding: 10px;">${reg.grade || '-'}</td>
                  <td style="border: 1px solid #d1d5db; padding: 10px;">${reg.email}</td>
                  <td style="border: 1px solid #d1d5db; padding: 10px;">${reg.phone || '-'}</td>
                  <td style="border: 1px solid #d1d5db; padding: 10px;">${new Date(reg.registrationDate).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      `;
    }).join('');

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Event Participants Report</title>
            <style>
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getEventById = (id: number) => events.find(e => e.id === id);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Reports & Analytics
        </h2>
        <p className="text-gray-600">Comprehensive event and registration reports</p>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {events.map(event => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {[...new Set(events.map(e => e.category))].map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end space-x-2">
              <Button onClick={exportEventReport} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export Events
              </Button>
              <Button onClick={exportStudentReport} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export Students
              </Button>
            </div>
            <div className="flex items-end space-x-2">
              <Button 
                onClick={() => printEventParticipants()}
                variant="outline" 
                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print All Events
              </Button>
              {selectedEvent !== 'all' && (
                <Button 
                  onClick={() => printEventParticipants(parseInt(selectedEvent))}
                  variant="outline" 
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Selected
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center">
            <Trophy className="h-4 w-4 mr-2" />
            Event Reports
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Student Reports
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Students</p>
                    <p className="text-3xl font-bold">{stats.totalStudents}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Registrations</p>
                    <p className="text-3xl font-bold">{stats.totalRegistrations}</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Avg per Event</p>
                    <p className="text-3xl font-bold">{stats.averageRegistrationsPerEvent.toFixed(1)}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Most Popular</p>
                    <p className="text-lg font-bold">{stats.mostPopularEvent?.name || 'N/A'}</p>
                    <p className="text-orange-200 text-sm">{stats.mostPopularEvent?.registrations || 0} registrations</p>
                  </div>
                  <Trophy className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Statistics */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.categoryStats.map(category => (
                  <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{category.category}</h3>
                      <p className="text-sm text-gray-600">{category.events} events</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{category.registrations}/{category.capacity}</p>
                      <p className="text-sm text-gray-600">{category.fillPercentage.toFixed(1)}% filled</p>
                    </div>
                    <div className="w-24">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${category.fillPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Event-wise Registration Report</CardTitle>
                <Button 
                  onClick={() => printEventParticipants()}
                  variant="outline"
                  className="bg-green-50 hover:bg-green-100 text-green-700"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print All Events
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Event Name</th>
                      <th className="text-left p-3">Category</th>
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Registrations</th>
                      <th className="text-left p-3">Capacity</th>
                      <th className="text-left p-3">Fill %</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.eventStats.map(event => (
                      <tr key={event.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{event.name}</td>
                        <td className="p-3">
                          <Badge variant="outline">{event.category}</Badge>
                        </td>
                        <td className="p-3">{new Date(event.date).toLocaleDateString()}</td>
                        <td className="p-3">{event.registrations}</td>
                        <td className="p-3">{event.maxParticipants}</td>
                        <td className="p-3">{event.fillPercentage.toFixed(1)}%</td>
                        <td className="p-3">
                          <Badge 
                            variant={
                              event.registrations >= event.maxParticipants 
                                ? "destructive" 
                                : event.fillPercentage > 80 
                                  ? "default" 
                                  : "secondary"
                            }
                          >
                            {event.registrations >= event.maxParticipants 
                              ? "Full" 
                              : event.fillPercentage > 80 
                                ? "Filling" 
                                : "Open"
                            }
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button
                            onClick={() => printEventParticipants(event.id)}
                            variant="outline"
                            size="sm"
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                          >
                            <Printer className="h-3 w-3 mr-1" />
                            Print
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Registration Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Showing {filteredRegistrations.length} registrations
                  {selectedEvent !== 'all' && ` for ${events.find(e => e.id === parseInt(selectedEvent))?.name}`}
                  {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Student Name</th>
                        <th className="text-left p-3">Student ID</th>
                        <th className="text-left p-3">Grade</th>
                        <th className="text-left p-3">Event</th>
                        <th className="text-left p-3">Category</th>
                        <th className="text-left p-3">Registration Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistrations.map(registration => {
                        const event = getEventById(registration.eventId);
                        return (
                          <tr key={registration.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{registration.studentName}</td>
                            <td className="p-3">{registration.studentId}</td>
                            <td className="p-3">
                              {registration.grade && (
                                <Badge variant="outline">{registration.grade}</Badge>
                              )}
                            </td>
                            <td className="p-3">{event?.name}</td>
                            <td className="p-3">{event?.category}</td>
                            <td className="p-3">
                              {new Date(registration.registrationDate).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Grade-wise Participation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.gradeStats).map(([grade, count]) => (
                    <div key={grade} className="flex items-center justify-between">
                      <span className="font-medium">{grade}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(count / stats.totalRegistrations) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Events */}
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.eventStats.slice(0, 5).map((event, index) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{event.name}</p>
                          <p className="text-sm text-gray-600">{event.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{event.registrations}</p>
                        <p className="text-sm text-gray-600">registrations</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPanel;
