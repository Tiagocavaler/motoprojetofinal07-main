[Setup]
AppName=MotoProjeto
AppVersion=1.0.0
DefaultDirName={pf}\MotoProjeto
DefaultGroupName=MotoProjeto
OutputDir=.
OutputBaseFilename=MotoProjeto-Setup-Com-Musica
Compression=lzma
SolidCompression=yes
WizardStyle=modern

[Files]
Source: "MotoProjeto\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs
Source: "musica.mp3"; DestDir: "{tmp}"; Flags: dontcopy

[Icons]
Name: "{group}\MotoProjeto"; Filename: "{app}\MotoProjeto.exe"
Name: "{commondesktop}\MotoProjeto"; Filename: "{app}\MotoProjeto.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Criar ícone na Área de Trabalho"; GroupDescription: "Ícones adicionais:"

[Code]
function mciSendString(l1:String; l2:String; i1,i2:Integer): Integer;
  external 'mciSendStringW@winmm.dll stdcall';

function InitializeSetup(): Boolean;
begin
  ExtractTemporaryFile('musica.mp3');
  mciSendString('open "' + ExpandConstant('{tmp}\musica.mp3') + '" type mpegvideo alias bgm', '', 0, 0);
  mciSendString('play bgm repeat', '', 0, 0);
  Result := True;
end;

procedure DeinitializeSetup();
begin
  mciSendString('stop bgm', '', 0, 0);
  mciSendString('close bgm', '', 0, 0);
end;