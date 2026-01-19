{ pkgs }: {
  deps = [
    pkgs.run
    pkgs.psmisc
    pkgs.nodejs
    pkgs.python3
    pkgs.ffmpeg
  ];
}