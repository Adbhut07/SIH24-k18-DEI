import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DemoVideo() {
  return (
    <Card id="demo" className="w-full mb-12">
      <CardHeader>
        <CardTitle>See Our Platform in Action</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/9vwTHA04Gi0"
            title="DRDO AI-Powered Interview Platform Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </CardContent>
    </Card>
  )
}

