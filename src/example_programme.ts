export const example_programme = `\
# Writing your first swim instruction:
# Basic swim instructions are written using a distance and a stroke name.
200 Freestyle
100 Breaststroke

# Stroke names can be written in full form as shown above, short form,
# and abbreviated form. The following three instructions are equivalent.
50 Freestyle
50 Free
50 Fr

# Same again for other strokes. I prefer to use the full form, so I will
# continue to use it for the rest of this tutorial. In general I recommend
# choosing one form (full, short, or abbreviated) and sticking with it
# throughout your whole programme for concistancy.
100 Backstroke
100 Back
100 Bk

100 Breaststroke
100 Breast
100 Br

100 Butterfly
100 Fly
100 Fl

# One can specify stroke types (kick, pull, or drill) after the stroke name.
100 Backstroke Kick
50 Breaststroke Pull

# When performing kick and pull, it is common to use special gear. These
# can be specified using the + symbol. You can specify multiple pieces
# of gear by separating each one with a space. The SwimDSL editor will
# show you an error message if you make an invalid combination of gear
# for the specified stroke type.
100 Backstroke Kick + Fins Board
200 Freestyle + Fins
50 Freestyle Pull + Bouy Paddles

# To specify the pace for a particular instruction, use the @ symbol.
# Pace can be specified using a fixed time, such as 1:00 for one minute
# or a percentage of perceived rate of excertion, such as 75%.
125 Breaststroke @ 2:30
25 Freestyle @ 0:20
100 Backstroke @ 60%
50 Backstroke @ 90%

# When using percentage pace specification, we can specify increasing or
# decreasing effort using a hyphen and a greater-than symbol (->).
50 Butterfly @ 55% -> 75%
100 Freestyle @ 80% -> 50%

# Sometimes its nice to use words rather than numbers to specify pace.
# Pace names can be defined using the Pace keyword and a specific
# percentage. I recomend placing these definitions close to the top of
# the file before the first instruction.
Pace easy = 45%
Pace medium = 65%
Pace hard = 90%

150 Backstroke @ medium
200 Freestyle @ easy -> hard

# Swimmers often need to take breaks, use the rest keyword to specify
# a fixed duration of resting.
1:00 rest
0:30 rest

# To repeat an instruction multiple times, use the x symbol.
8 x 25 Freestyle @ 0:30
4 x 75 Backstroke

# Instructions can be grouped together to apply a repition, pace, stroke
# type, or gear to many different instructions at once.
2 x {
    50 Backstroke
    100 Freestyle
    50 Breaststroke
    0:30 rest
} Pull + Bouy @ 70%

# When using a fixed time pace on a grouped isntruction, the pace applies to
# the whole group as a single item, meaning the following medely should be
# swim in under two minutes, rather than having 2 minutes for each length.
{
  25 Butterfly
  25 Backstroke
  25 Breaststroke
  25 Freestyle
} @ 2:00

# Groups and repitition can be infinitely nested. The following is perfectly
# valid SwimDSL.
2 x {
  50 Freestyle
  2 x {
    50 Backstroke
    2 x {
      50 Breaststroke
      2 x {
        50 Butterfly
        2 x 50 Freestyle
      }
    }
  }
}

# The earlier instruction of 25 butterfly, backstroke, breaststroke,
# and freestyle make up an individual medely and can be written more
# concisely using the IndividualMedley stroke.
100 IndividualMedley @ 4:00

# When using fixed time pace and repitition, the time applies to each
# individual repitition, rather than grouping them all into a single
# item. The following should take a total of four minutes, rather than
# just one.
4 x 75 Freestyle @ 1:00

# It is very usefull for SwimDSL to know information such as the length
# of the pool the programme is being swum in, and the unit that all
# distances are specified in. This allows for the rendered output to show
# the total distance in the programme. This should always be specified at
# the very top of the file, at not appear more than once!
set PoolLength 25 metres
set DistanceUnit metres

# You can write arbitrary text to help describe a particular instruction
# or provide section headers using the > symbol
> This text shows verbatim in the rendered document

# Finally, you should have noticed already, any text preceeded by a
# hash symbol (#) is a comment, and completely ignored when rendering.

# And thats it! You are now well versed in SwimDSL. Make sure to keep
# the order of you instructions correct, that is repititions, distance,
# stroke name, stroke type, required gear, and finally pace. If your use
# these in the wrong order, the editor will show you an error message.

# Go fourth! 
`;
