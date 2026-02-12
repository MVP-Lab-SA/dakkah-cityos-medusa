import React from 'react'

interface FreelancerProfileBlockProps {
  heading?: string
  showPortfolio?: boolean
  showReviews?: boolean
  showAvailability?: boolean
  layout?: 'full' | 'card' | 'sidebar'
}

const placeholderFreelancer = {
  name: 'Jordan Rivera',
  title: 'Senior Full-Stack Developer',
  hourlyRate: 95,
  availability: 'Available',
  location: 'San Francisco, CA',
  bio: 'Experienced full-stack developer with 8+ years building scalable web applications. Specialized in React, Node.js, and cloud architecture. Passionate about clean code and user-centric design.',
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'GraphQL', 'Docker', 'Next.js'],
  completedProjects: 127,
  rating: 4.9,
  reviewCount: 84,
}

const portfolioItems = [
  { title: 'E-Commerce Platform', category: 'Web App' },
  { title: 'Health Tracker Dashboard', category: 'Dashboard' },
  { title: 'Social Media Analytics', category: 'SaaS' },
  { title: 'Restaurant Booking System', category: 'Web App' },
  { title: 'Real Estate Portal', category: 'Marketplace' },
  { title: 'Learning Management System', category: 'EdTech' },
]

const reviews = [
  { author: 'Michael T.', rating: 5, text: 'Exceptional work! Delivered ahead of schedule with impeccable code quality.', date: 'Feb 2026' },
  { author: 'Sarah L.', rating: 5, text: 'Great communicator and technically excellent. Will definitely hire again.', date: 'Jan 2026' },
  { author: 'David K.', rating: 4, text: 'Very skilled developer. Handled complex requirements with ease.', date: 'Dec 2025' },
]

export const FreelancerProfileBlock: React.FC<FreelancerProfileBlockProps> = ({
  heading,
  showPortfolio = true,
  showReviews = true,
  showAvailability = true,
  layout = 'full',
}) => {
  const renderStars = (rating: number) => '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '')

  if (layout === 'card') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-md">
          <div className="bg-ds-card border border-ds-border rounded-lg shadow-sm p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-ds-muted animate-pulse mx-auto mb-4" />
            <h3 className="text-lg font-bold text-ds-foreground">{placeholderFreelancer.name}</h3>
            <p className="text-sm text-ds-muted-foreground mb-2">{placeholderFreelancer.title}</p>
            {showAvailability && (
              <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 mb-3">
                {placeholderFreelancer.availability}
              </span>
            )}
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-yellow-500 text-sm">{renderStars(placeholderFreelancer.rating)}</span>
              <span className="text-sm font-medium text-ds-foreground">{placeholderFreelancer.rating}</span>
              <span className="text-xs text-ds-muted-foreground">({placeholderFreelancer.reviewCount})</span>
            </div>
            <p className="text-lg font-bold text-ds-foreground mb-3">${placeholderFreelancer.hourlyRate}/hr</p>
            <div className="flex flex-wrap justify-center gap-1 mb-4">
              {placeholderFreelancer.skills.slice(0, 5).map((skill) => (
                <span key={skill} className="text-xs px-2 py-1 rounded-full bg-ds-muted text-ds-muted-foreground">{skill}</span>
              ))}
            </div>
            <button className="w-full px-6 py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Hire Me
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (layout === 'sidebar') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-ds-card border border-ds-border rounded-lg shadow-sm p-6 sticky top-4">
                <div className="w-24 h-24 rounded-full bg-ds-muted animate-pulse mx-auto mb-4" />
                <h3 className="text-lg font-bold text-ds-foreground text-center">{placeholderFreelancer.name}</h3>
                <p className="text-sm text-ds-muted-foreground text-center mb-2">{placeholderFreelancer.title}</p>
                {showAvailability && (
                  <div className="text-center mb-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                      {placeholderFreelancer.availability}
                    </span>
                  </div>
                )}
                <div className="text-center mb-3">
                  <span className="text-yellow-500 text-sm">{renderStars(placeholderFreelancer.rating)}</span>
                  <span className="text-sm ml-1 text-ds-foreground">{placeholderFreelancer.rating}</span>
                </div>
                <p className="text-center text-2xl font-bold text-ds-foreground mb-1">${placeholderFreelancer.hourlyRate}/hr</p>
                <p className="text-center text-xs text-ds-muted-foreground mb-4">{placeholderFreelancer.completedProjects} projects completed</p>
                <div className="flex flex-wrap justify-center gap-1 mb-4">
                  {placeholderFreelancer.skills.map((skill) => (
                    <span key={skill} className="text-xs px-2 py-1 rounded-full bg-ds-muted text-ds-muted-foreground">{skill}</span>
                  ))}
                </div>
                <button className="w-full px-6 py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Hire Me
                </button>
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <div className="bg-ds-card border border-ds-border rounded-lg p-6">
                <h4 className="font-semibold text-ds-foreground mb-3">About</h4>
                <p className="text-ds-muted-foreground">{placeholderFreelancer.bio}</p>
              </div>
              {showPortfolio && (
                <div className="bg-ds-card border border-ds-border rounded-lg p-6">
                  <h4 className="font-semibold text-ds-foreground mb-4">Portfolio</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {portfolioItems.map((item, i) => (
                      <div key={i} className="rounded-lg overflow-hidden border border-ds-border">
                        <div className="aspect-video bg-ds-muted animate-pulse" />
                        <div className="p-2">
                          <p className="text-sm font-medium text-ds-foreground">{item.title}</p>
                          <p className="text-xs text-ds-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {showReviews && (
                <div className="bg-ds-card border border-ds-border rounded-lg p-6">
                  <h4 className="font-semibold text-ds-foreground mb-4">Reviews</h4>
                  <div className="space-y-4">
                    {reviews.map((review, i) => (
                      <div key={i} className="border-b border-ds-border last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-ds-foreground text-sm">{review.author}</span>
                          <span className="text-xs text-ds-muted-foreground">{review.date}</span>
                        </div>
                        <span className="text-yellow-500 text-xs">{renderStars(review.rating)}</span>
                        <p className="text-sm text-ds-muted-foreground mt-1">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {heading && <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-8">{heading}</h2>}

        <div className="bg-ds-card border border-ds-border rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 border-b border-ds-border">
            <div className="w-28 h-28 rounded-full bg-ds-muted animate-pulse flex-shrink-0" />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-2xl font-bold text-ds-foreground">{placeholderFreelancer.name}</h3>
                  <p className="text-ds-muted-foreground">{placeholderFreelancer.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  {showAvailability && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">
                      {placeholderFreelancer.availability}
                    </span>
                  )}
                  <span className="text-xl font-bold text-ds-foreground">${placeholderFreelancer.hourlyRate}/hr</span>
                </div>
              </div>
              <p className="text-ds-muted-foreground mb-3">{placeholderFreelancer.bio}</p>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">{renderStars(placeholderFreelancer.rating)}</span>
                  <span className="text-sm font-medium text-ds-foreground">{placeholderFreelancer.rating}</span>
                  <span className="text-xs text-ds-muted-foreground">({placeholderFreelancer.reviewCount} reviews)</span>
                </div>
                <span className="text-sm text-ds-muted-foreground">{placeholderFreelancer.completedProjects} projects</span>
                <span className="text-sm text-ds-muted-foreground">{placeholderFreelancer.location}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {placeholderFreelancer.skills.map((skill) => (
                  <span key={skill} className="text-xs px-3 py-1 rounded-full bg-ds-muted text-ds-muted-foreground font-medium">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {showPortfolio && (
            <div className="p-6 md:p-8 border-b border-ds-border">
              <h4 className="font-semibold text-ds-foreground mb-4">Portfolio</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {portfolioItems.map((item, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-ds-border hover:shadow-sm transition-shadow">
                    <div className="aspect-video bg-ds-muted animate-pulse" />
                    <div className="p-3">
                      <p className="text-sm font-medium text-ds-foreground">{item.title}</p>
                      <p className="text-xs text-ds-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showReviews && (
            <div className="p-6 md:p-8 border-b border-ds-border">
              <h4 className="font-semibold text-ds-foreground mb-4">Client Reviews</h4>
              <div className="space-y-4">
                {reviews.map((review, i) => (
                  <div key={i} className="bg-ds-muted rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-ds-background animate-pulse" />
                        <span className="font-medium text-ds-foreground text-sm">{review.author}</span>
                      </div>
                      <span className="text-xs text-ds-muted-foreground">{review.date}</span>
                    </div>
                    <span className="text-yellow-500 text-sm">{renderStars(review.rating)}</span>
                    <p className="text-sm text-ds-muted-foreground mt-1">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 md:p-8">
            <button className="w-full md:w-auto px-8 py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Hire Me
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
