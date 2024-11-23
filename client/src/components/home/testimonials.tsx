import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const testimonials = [
  {
    quote: "This AI-powered platform has revolutionized our recruitment process, allowing us to identify top talent efficiently.",
    author: "Dr. Avinash Chander, Former Director General, DRDO"
  },
  {
    quote: "The virtual boardroom feature has made remote interviews seamless and effective, especially during challenging times.",
    author: "Dr. G. Satheesh Reddy, Secretary, Department of Defence R&D"
  },
  {
    quote: "The AI-assisted insights have been invaluable in making informed decisions during the interview process.",
    author: "Dr. Tessy Thomas, Director General, Aeronautical Systems, DRDO"
  }
]

export function Testimonials() {
  return (
    <div id="testimonials" className="mb-12">
      <h2 className="text-3xl font-bold mb-6">What Our Scientists Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">&ldquo;{testimonial.quote}&rdquo;</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-800 text-muted-foreground">- {testimonial.author}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

