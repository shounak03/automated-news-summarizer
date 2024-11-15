function About() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <main className="flex-grow p-4 flex flex-col m-4">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4 text-white">About Our News Summarizer</h2>
        <p className="text-lg mb-6 text-white">
          This app provides a convenient way to get summaries of the latest news articles. Simply browse the headlines on the home page, click on any article to view the full content, then click the "Summary" button to generate a concise summary.
        </p>
        <p className="text-lg text-white">
          Our goal is to help you stay informed without getting bogged down in lengthy articles. We leverage advanced language models to analyze article content and deliver insightful summaries tailored to your needs.
        </p>
      </div>
    </main>
    </div>
  );
}

export default About;