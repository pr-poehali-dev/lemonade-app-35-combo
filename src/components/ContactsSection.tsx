import Icon from "@/components/ui/icon";

export default function ContactsSection() {
  return (
    <div>
      <h2 className="font-pacifico text-3xl text-[#1A1A0F] mb-6">Контакты</h2>
      <div className="space-y-4">
        {[
          { icon: "MapPin", label: "Адрес", value: "Волгоград, Кировский р-н, Гжатский пер., 19", color: "bg-lemon/20 text-lemon-dark", href: null },
          { icon: "Phone", label: "Телефон", value: "+7 (996) 492-52-46", color: "bg-emerald/20 text-emerald-dark", href: "tel:+79964925246" },
          { icon: "Clock", label: "Часы работы", value: "Пн–Вс: 10:00 – 22:00", color: "bg-orange-100 text-orange-500", href: null },
          { icon: "Instagram", label: "Instagram", value: "@lemonade_fon", color: "bg-pink-100 text-pink-500", href: null },
          { icon: "MessageCircle", label: "WhatsApp", value: "Написать в WhatsApp", color: "bg-green-100 text-green-600", href: "https://wa.me/79964925246" },
          { icon: "Send", label: "Telegram", value: "Написать в Telegram", color: "bg-sky-100 text-sky-500", href: "https://t.me/+79964925246" },
        ].map(({ icon, label, value, color, href }) => (
          <div key={label} className="animate-fade-in-up bg-white rounded-2xl p-5 border border-yellow-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon name={icon as "MapPin"} size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
              {href ? (
                <a href={href} className="font-bold text-emerald-dark hover:underline">{value}</a>
              ) : (
                <p className="font-bold text-[#1A1A0F]">{value}</p>
              )}
            </div>
          </div>
        ))}

        {/* Google Maps */}
        <div className="animate-fade-in-up bg-white rounded-3xl overflow-hidden border border-yellow-100 shadow-sm">
          <div className="px-5 pt-5 pb-3 flex items-center gap-2">
            <Icon name="Map" size={18} />
            <span className="font-golos font-bold text-base text-[#1A1A0F]">Мы на карте</span>
          </div>
          <div className="w-full h-64">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2731.5!2d44.4825!3d48.5075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x411735a2c4db3a4b%3A0x0!2z0JPQttCw0YLRgdC60LjQuSDQv9C10YAuLCAxOSwg0JLQvtC70LPQvtCz0YDQsNC00YHQutCw0Y8g0L7QsdC7LiwgNDAwMDY5!5e0!3m2!1sru!2sru!4v1711449600000!5m2!1sru!2sru&q=Волгоград,+Кировский+район,+Гжатский+переулок,+19"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Лемонад фон на карте"
            />
          </div>
          <div className="px-5 py-3 bg-yellow-50/50 flex items-center gap-2">
            <Icon name="Navigation" size={14} />
            <a
              href="https://maps.google.com/?q=Волгоград,+Кировский+район,+Гжатский+переулок,+19"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-emerald-dark hover:underline"
            >
              Открыть в Google Maps
            </a>
          </div>
        </div>

        <div className="animate-fade-in-up bg-white rounded-3xl p-6 border border-yellow-100 shadow-sm mt-2">
          <h3 className="font-golos font-bold text-base text-[#1A1A0F] mb-4 flex items-center gap-2">
            <Icon name="MessageCircle" size={18} />
            Написать нам
          </h3>
          <div className="space-y-3">
            <input
              placeholder="Ваше имя"
              className="w-full border border-yellow-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lemon bg-yellow-50/50"
            />
            <textarea
              placeholder="Ваше сообщение..."
              rows={4}
              className="w-full border border-yellow-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lemon bg-yellow-50/50 resize-none"
            />
            <button className="btn-press w-full bg-lemon hover:bg-lemon-dark text-[#1A1A0F] font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2">
              <Icon name="Send" size={16} />
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
