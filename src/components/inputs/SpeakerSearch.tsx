import { useState } from "react";
import SelectSearch, {
  DomProps,
  OptionSnapshot,
  SelectedOption,
} from "react-select-search";
import { searchSpeakers } from "../../data/speakers/speakers.api";
import { Speaker } from "../../models/Speaker";

interface SpeakerSearchProps {
  onChange: (speaker: Speaker | null) => void;
  onSearch: (speakers: Speaker[]) => void;
  filter: (speaker: Speaker) => boolean;
}
let speakersState: Speaker[] = [];

const SpeakerSearch: React.FC<SpeakerSearchProps> = ({
  onChange,
  onSearch,
  filter,
}) => {
  const renderEmplyMessage = () => {
    return (
      <button onClick={(_) => onChange(null)} type="button">
        Agregar nuevo Speaker
      </button>
    );
  };
  const renderSpeaker = (
    domprops: DomProps,
    option: SelectedOption,
    snapshop: OptionSnapshot,
    className: string
  ) => {
    return (
      <button
        tabIndex={parseInt(domprops.tabIndex)}
        value={domprops.value}
        onMouseDown={(e) => domprops.onMouseDown(e as any)}
        onKeyDown={(e) => domprops.onKeyDown(e as any)}
        onKeyPress={(e) => domprops.onKeyPress(e as any)}
        onBlur={(e) => domprops.onBlur(e as any)}
        disabled={domprops.disabled}
        className={className}
        type="button"
      >
        <span>
          <img
            alt=""
            width="50"
            height="50"
            src={(option as any).photo}
            style={{
              borderRadius: "50%",
              verticalAlign: "middle",
              marginRight: "10px",
            }}
          />
          <span>{(option as any).name}</span>
        </span>
      </button>
    );
  };

  return (
    <SelectSearch
      options={[]}
      onBlur={() => {}}
      onFocus={() => {}}
      onChange={(value) =>
        onChange(speakersState.filter((x) => x.email == value.toString())[0])
      }
      debounce={500}
      renderOption={renderSpeaker}
      getOptions={(query) => {
        return new Promise((resolve, reject) => {
          searchSpeakers(query)
            .then((speakers) => {
              onSearch(speakers);
              speakersState = speakers;
              return speakersState;
            })
            .then((speakers) => {
              resolve(
                speakers
                  ? speakers
                      .filter(filter)
                      ?.slice(0, 5)
                      .map(({ email, name, lastname, photo }) => ({
                        value: email,
                        name: `${name} ${lastname}`,
                        photo: photo,
                      }))
                  : []
              );
            })
            .catch(reject);
        });
      }}
      search
      placeholder="Ingresa el nombre del Speaker"
      emptyMessage={renderEmplyMessage() as any}
    />
  );
};

export default SpeakerSearch;
