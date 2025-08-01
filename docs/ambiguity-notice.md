# Notice of known ambiguity in language

When using a variable rate or fixed time pace specification on an instruction
with inline repetition, it is ambiguous whether the pace applies to each
individual element of the repetition or to the whole repetition as a single
instruction.

```SwimDSL
4 x 50 Freestyle @ 50% -> 80%

# This could be interpreted as either of the following
{ 4 x 50 Freestyle } @ 50% -> 80%  # Build over period of 200 metres
4 x { 50 Freestyle @ 50% -> 80% }  # Repeatedly build each 50
```

```SwimDSL
3 x 75 Butterfly @ 1:00

# This could be interpreted as either of the following
{ 3 x 75 Butterfly } @ 1:00  # 225 metres in one minute
3 x { 75 Butterfly @ 1:00 }  # Three minutes total
```

Internally, SwimDSL interprets each of these examples as the second of the
given expansions. That is, the pace is applied to each individual element within
the repetition.
