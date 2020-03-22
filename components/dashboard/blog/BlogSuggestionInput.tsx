import { Input } from "@artsy/palette";
import { useState, useEffect } from "react";

/**
 * TODO: Add a fading transition effect to the placeholder text.
 * Before the placeholder is changed, fade to 0 opacity then change
 * the text and fade back to 1 opacity.
 */

const SuggestionTransitionDelayInMs = 6500;

/**
 * The blog suggestion input will slowly rotate through these options
 * in a random order.
 */
const promptingQuestions = [
  "What have you been struggling with lately?",
  "What have you learned recently?",
  "What's something you wish you would've known 3 months ago?",
  "What's an open source project we've written or used that is cool?",
  "What do you find about our culture that is uniquely beneficial?",
  "What in our stack would you like to learn more about?"
];

type InputProps = React.ComponentProps<typeof Input>;
export const BlogSuggestionInput = (props: InputProps) => {
  const [remainingPhrases, setRemainingPhrases] = useState(
    shuffle(promptingQuestions)
  );
  useEffect(() => {
    let interval = setInterval(() => {
      if (remainingPhrases.length <= 1) {
        setRemainingPhrases(shuffle(promptingQuestions));
      } else {
        setRemainingPhrases(remainingPhrases.slice(1));
      }
    }, SuggestionTransitionDelayInMs);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return <Input placeholder={remainingPhrases[0]} {...props} />;
};

const shuffle = (array: string[]) => {
  let remaining = array.length;
  let currentItem;
  let temp;

  // While there remain elements to shuffle…
  while (remaining) {
    // Pick a remaining element…
    currentItem = Math.floor(Math.random() * remaining--);

    // And swap it with the current element.
    temp = array[remaining];
    array[remaining] = array[currentItem];
    array[currentItem] = temp;
  }

  return array;
};
