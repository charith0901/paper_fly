import { MapPinIcon, PhoneIcon, ClockIcon } from 'lucide-react';
const ContactInfo = () => {
  return <section id="contact" className="py-16 bg-slate-800/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Visit Us
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        <div className="backdrop-blur-sm bg-slate-800/50 rounded-lg border border-white/10 p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-cyan-400 mb-4">
                Contact Information
              </h3>
              {[{
              icon: MapPinIcon,
              title: 'Location',
              content: 'Koralaima, Gonapola, Sri Lanka'
            }, {
              icon: PhoneIcon,
              title: 'Phone',
              content: '076 476 6975'
            }, {
              icon: ClockIcon,
              title: 'Hours',
              content: 'Daily: 11:00 AM - 10:00 PM'
            }].map((item, index) => <div key={index} className="flex items-start space-x-4">
                  <item.icon className="text-cyan-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-gray-200">{item.title}</h4>
                    <p className="text-gray-300">{item.content}</p>
                  </div>
                </div>)}
            </div>
            <div className="h-64 md:h-auto rounded-lg overflow-hidden bg-slate-900/50 border border-white/10">
              <div className="h-full w-full flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="mb-2">
                    <MapPinIcon className="mx-auto text-cyan-400" size={48} />
                  </div>
                  <h4 className="font-bold text-gray-200 text-lg">
                    Ajith Hotel
                  </h4>
                  <p className="text-gray-300">Koralaima, Gonapola, Sri Lanka</p>
                  <p className="mt-2 text-sm text-gray-400">
                    Interactive map available when visiting our website
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default ContactInfo;