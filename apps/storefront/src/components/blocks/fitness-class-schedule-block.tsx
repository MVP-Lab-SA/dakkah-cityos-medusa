import React, { useState } from 'react'

interface FitnessClass {
  id: string
  name: string
  instructor: string
  time: string
  duration: string
  type: string
  capacity: number
  enrolled: number
}

interface FitnessClassScheduleBlockProps {
  heading?: string
  view?: 'weekly' | 'daily' | 'list'
  showInstructor?: boolean
  showCapacity?: boolean
  filterByType?: boolean
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const classTypes = ['All', 'Yoga', 'HIIT', 'Spin', 'Pilates', 'Boxing', 'Dance']

const placeholderSchedule: Record<string, FitnessClass[]> = {
  Mon: [
    { id: '1', name: 'Morning Yoga', instructor: 'Emma S.', time: '06:30', duration: '60 min', type: 'Yoga', capacity: 20, enrolled: 14 },
    { id: '2', name: 'HIIT Burn', instructor: 'Jake R.', time: '08:00', duration: '45 min', type: 'HIIT', capacity: 25, enrolled: 22 },
    { id: '3', name: 'Spin Class', instructor: 'Maria L.', time: '12:00', duration: '45 min', type: 'Spin', capacity: 30, enrolled: 18 },
    { id: '4', name: 'Power Pilates', instructor: 'Sophie T.', time: '17:30', duration: '50 min', type: 'Pilates', capacity: 15, enrolled: 15 },
    { id: '5', name: 'Boxing Fit', instructor: 'Carlos M.', time: '19:00', duration: '60 min', type: 'Boxing', capacity: 20, enrolled: 12 },
  ],
  Tue: [
    { id: '6', name: 'Sunrise Spin', instructor: 'Maria L.', time: '06:00', duration: '45 min', type: 'Spin', capacity: 30, enrolled: 25 },
    { id: '7', name: 'Vinyasa Flow', instructor: 'Emma S.', time: '09:00', duration: '75 min', type: 'Yoga', capacity: 20, enrolled: 16 },
    { id: '8', name: 'Dance Cardio', instructor: 'Lisa K.', time: '18:00', duration: '50 min', type: 'Dance', capacity: 25, enrolled: 20 },
  ],
  Wed: [
    { id: '9', name: 'HIIT Express', instructor: 'Jake R.', time: '07:00', duration: '30 min', type: 'HIIT', capacity: 25, enrolled: 24 },
    { id: '10', name: 'Gentle Yoga', instructor: 'Emma S.', time: '10:00', duration: '60 min', type: 'Yoga', capacity: 20, enrolled: 8 },
    { id: '11', name: 'Spin & Tone', instructor: 'Maria L.', time: '17:00', duration: '50 min', type: 'Spin', capacity: 30, enrolled: 27 },
  ],
  Thu: [
    { id: '12', name: 'Boxing Basics', instructor: 'Carlos M.', time: '08:00', duration: '45 min', type: 'Boxing', capacity: 20, enrolled: 10 },
    { id: '13', name: 'Pilates Core', instructor: 'Sophie T.', time: '12:00', duration: '45 min', type: 'Pilates', capacity: 15, enrolled: 13 },
  ],
  Fri: [
    { id: '14', name: 'HIIT Friday', instructor: 'Jake R.', time: '07:00', duration: '45 min', type: 'HIIT', capacity: 25, enrolled: 19 },
    { id: '15', name: 'Yoga Unwind', instructor: 'Emma S.', time: '17:30', duration: '60 min', type: 'Yoga', capacity: 20, enrolled: 17 },
  ],
  Sat: [
    { id: '16', name: 'Weekend Warrior', instructor: 'Jake R.', time: '09:00', duration: '60 min', type: 'HIIT', capacity: 30, enrolled: 28 },
    { id: '17', name: 'Dance Party', instructor: 'Lisa K.', time: '11:00', duration: '50 min', type: 'Dance', capacity: 25, enrolled: 22 },
  ],
  Sun: [
    { id: '18', name: 'Restorative Yoga', instructor: 'Emma S.', time: '10:00', duration: '75 min', type: 'Yoga', capacity: 20, enrolled: 12 },
  ],
}

export const FitnessClassScheduleBlock: React.FC<FitnessClassScheduleBlockProps> = ({
  heading = 'Class Schedule',
  view = 'weekly',
  showInstructor = true,
  showCapacity = true,
  filterByType = true,
}) => {
  const [activeDay, setActiveDay] = useState('Mon')
  const [selectedType, setSelectedType] = useState('All')

  const getClassesForDay = (day: string) => {
    const classes = placeholderSchedule[day] || []
    return selectedType === 'All' ? classes : classes.filter((c) => c.type === selectedType)
  }

  const capacityPercent = (c: FitnessClass) => Math.round((c.enrolled / c.capacity) * 100)
  const isFull = (c: FitnessClass) => c.enrolled >= c.capacity

  const ClassCard = ({ cls }: { cls: FitnessClass }) => (
    <div className={`bg-ds-card border rounded-lg p-4 hover:shadow-sm transition-shadow ${isFull(cls) ? 'border-ds-border opacity-75' : 'border-ds-border'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-ds-muted text-ds-muted-foreground">{cls.type}</span>
        <span className="text-sm font-medium text-ds-foreground">{cls.time}</span>
      </div>
      <h4 className="font-semibold text-ds-foreground mb-1">{cls.name}</h4>
      <p className="text-xs text-ds-muted-foreground mb-2">{cls.duration}</p>
      {showInstructor && (
        <p className="text-sm text-ds-muted-foreground mb-2">{cls.instructor}</p>
      )}
      {showCapacity && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-ds-muted-foreground">{cls.enrolled}/{cls.capacity} spots</span>
            <span className={isFull(cls) ? 'text-red-500 font-medium' : 'text-ds-muted-foreground'}>{isFull(cls) ? 'Full' : `${capacityPercent(cls)}%`}</span>
          </div>
          <div className="w-full bg-ds-muted rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${isFull(cls) ? 'bg-red-500' : capacityPercent(cls) > 80 ? 'bg-yellow-500' : 'bg-ds-primary'}`}
              style={{ width: `${capacityPercent(cls)}%` }}
            />
          </div>
        </div>
      )}
      <button
        disabled={isFull(cls)}
        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-opacity ${
          isFull(cls) ? 'bg-ds-muted text-ds-muted-foreground cursor-not-allowed' : 'bg-ds-primary text-ds-primary-foreground hover:opacity-90'
        }`}
      >
        {isFull(cls) ? 'Waitlist' : 'Join Class'}
      </button>
    </div>
  )

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground mb-8">{heading}</h2>

        {filterByType && (
          <div className="flex flex-wrap gap-2 mb-6">
            {classTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-ds-primary text-ds-primary-foreground'
                    : 'bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {weekDays.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeDay === day
                  ? 'bg-ds-primary text-ds-primary-foreground'
                  : 'bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {view === 'list' ? (
          <div className="space-y-3">
            {getClassesForDay(activeDay).map((cls) => (
              <div key={cls.id} className="bg-ds-card border border-ds-border rounded-lg p-4 flex items-center gap-4">
                <div className="w-16 text-center flex-shrink-0">
                  <p className="text-sm font-semibold text-ds-foreground">{cls.time}</p>
                  <p className="text-xs text-ds-muted-foreground">{cls.duration}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-ds-foreground">{cls.name}</h4>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-ds-muted text-ds-muted-foreground">{cls.type}</span>
                  </div>
                  {showInstructor && <p className="text-sm text-ds-muted-foreground">{cls.instructor}</p>}
                </div>
                {showCapacity && (
                  <div className="w-24 flex-shrink-0">
                    <div className="w-full bg-ds-muted rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${isFull(cls) ? 'bg-red-500' : 'bg-ds-primary'}`} style={{ width: `${capacityPercent(cls)}%` }} />
                    </div>
                    <p className="text-xs text-ds-muted-foreground text-center mt-1">{cls.enrolled}/{cls.capacity}</p>
                  </div>
                )}
                <button
                  disabled={isFull(cls)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0 ${
                    isFull(cls) ? 'bg-ds-muted text-ds-muted-foreground cursor-not-allowed' : 'bg-ds-primary text-ds-primary-foreground hover:opacity-90 transition-opacity'
                  }`}
                >
                  {isFull(cls) ? 'Waitlist' : 'Join Class'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getClassesForDay(activeDay).map((cls) => (
              <ClassCard key={cls.id} cls={cls} />
            ))}
          </div>
        )}

        {getClassesForDay(activeDay).length === 0 && (
          <div className="text-center py-12">
            <p className="text-ds-muted-foreground">No classes scheduled for this day</p>
          </div>
        )}
      </div>
    </section>
  )
}
