import React, { useCallback } from "react";
import { Dropdown, DropdownOption } from "components";
import { LightTopo, TopoStatus } from "types";
import { useRouter } from "next/router";
import { encodeUUID } from "helpers/utils";

interface UserActionDropdownProps {
  topo: LightTopo;
  position: { x: number; y: number };
  onSendToValidationClick: () => void;
  onSendToDraftClick: () => void;
  onDeleteClick: () => void;
  onSelect?: () => void;
}

export const UserActionDropdown: React.FC<UserActionDropdownProps> = (
  props: UserActionDropdownProps
) => {
  const router = useRouter();

  //TODO
  const downloadTopo = useCallback(() => {
    alert("à venir");
    console.log("Downloading the topo...");
  }, []);

  const options: DropdownOption[] = [];
  if (props.topo.status !== TopoStatus.Submitted) {
    options.push({
      value: "Ouvrir",
      action: () => router.push(`/topo/${encodeUUID(props.topo.id)}`),
    });
  }
  if (props.topo.status === TopoStatus.Validated) {
    options.push({ value: "Télécharger", action: downloadTopo });
  }
  if (props.topo.status === TopoStatus.Draft) {
    options.push({
      value: "Envoyer en validation",
      action: props.onSendToValidationClick,
    });
  }
  if (props.topo.status === TopoStatus.Draft) {
    options.push({
      value: "Retourner en brouillon",
      action: props.onSendToDraftClick,
    });
  }
  options.push({ value: "Supprimer", action: props.onDeleteClick });

  return (
    <Dropdown
      className="w-64"
      position={props.position}
      options={options}
      onSelect={props.onSelect}
    />
  );
};

UserActionDropdown.displayName = "UserActionDropdown";
