param(
    [string]$PuttyInput = 'G:\EndoTech Singapore\iRoot\BCS art work\BCS Putty.png',
    [string]$SealerInput = 'G:\EndoTech Singapore\iRoot\BCS art work\BCS Sealer.png',
    [string]$OutputDir = 'C:\Users\Stephen\Documents\GitHub\endotech-homepage\public\downloads\metallic-packshots'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

function Clamp-Unit {
    param([double]$Value)

    if ($Value -lt 0.0) { return 0.0 }
    if ($Value -gt 1.0) { return 1.0 }
    return $Value
}

function Get-HueDegrees {
    param(
        [double]$R,
        [double]$G,
        [double]$B
    )

    $max = [Math]::Max($R, [Math]::Max($G, $B))
    $min = [Math]::Min($R, [Math]::Min($G, $B))
    $delta = $max - $min

    if ($delta -eq 0.0) {
        return 0.0
    }

    if ($max -eq $R) {
        $hue = 60.0 * ((($G - $B) / $delta) % 6.0)
    }
    elseif ($max -eq $G) {
        $hue = 60.0 * ((($B - $R) / $delta) + 2.0)
    }
    else {
        $hue = 60.0 * ((($R - $G) / $delta) + 4.0)
    }

    if ($hue -lt 0.0) {
        $hue += 360.0
    }

    return $hue
}

function Get-Saturation {
    param(
        [double]$R,
        [double]$G,
        [double]$B
    )

    $max = [Math]::Max($R, [Math]::Max($G, $B))
    $min = [Math]::Min($R, [Math]::Min($G, $B))

    if ($max -eq 0.0) {
        return 0.0
    }

    return ($max - $min) / $max
}

function Get-Luminance {
    param(
        [double]$R,
        [double]$G,
        [double]$B
    )

    return (0.299 * $R) + (0.587 * $G) + (0.114 * $B)
}

function Get-MetallicBands {
	param(
	    [double]$Xn,
	    [double]$Yn
	)

    $bandA = [Math]::Exp(-([Math]::Pow(($Xn - 0.16) / 0.035, 2.0))) * 0.28
    $bandB = [Math]::Exp(-([Math]::Pow(($Xn - 0.31) / 0.07, 2.0))) * 0.16
    $bandC = [Math]::Exp(-([Math]::Pow(($Xn - 0.64) / 0.06, 2.0))) * 0.14
    $bandD = [Math]::Exp(-([Math]::Pow(($Xn - 0.86) / 0.028, 2.0))) * 0.24
    $edgeShade = -0.10 * [Math]::Pow([Math]::Abs(($Xn - 0.5) * 2.0), 1.18)
    $microSheen = ([Math]::Sin(($Yn * 170.0) + ($Xn * 20.0)) * 0.010) + ([Math]::Sin($Yn * 1100.0) * 0.005)

    return $bandA + $bandB + $bandC + $bandD + $edgeShade + $microSheen
}

function Get-BrushedNoise {
    param(
        [int]$X,
        [int]$Y
    )

    $value = ([Math]::Sin(($Y * 0.23) + ($X * 0.021)) + [Math]::Sin($Y * 0.81) + [Math]::Sin(($Y * 1.57) - ($X * 0.013))) / 3.0
    return $value * 0.025
}

function Get-MetalColor {
    param(
        [string]$Tone,
        [double]$Lightness
    )

    $lightness = Clamp-Unit $Lightness

    switch ($Tone) {
        'silver' {
            if ($lightness -lt 0.5) {
                $t = $lightness / 0.5
                $r = (0.47 * (1.0 - $t)) + (0.79 * $t)
                $g = (0.49 * (1.0 - $t)) + (0.82 * $t)
                $b = (0.53 * (1.0 - $t)) + (0.87 * $t)
            }
            else {
                $t = ($lightness - 0.5) / 0.5
                $r = (0.79 * (1.0 - $t)) + (0.985 * $t)
                $g = (0.82 * (1.0 - $t)) + (0.99 * $t)
                $b = (0.87 * (1.0 - $t)) + (0.995 * $t)
            }
        }
        'gold' {
            if ($lightness -lt 0.5) {
                $t = $lightness / 0.5
                $r = (0.45 * (1.0 - $t)) + (0.84 * $t)
                $g = (0.28 * (1.0 - $t)) + (0.67 * $t)
                $b = (0.05 * (1.0 - $t)) + (0.16 * $t)
            }
            else {
                $t = ($lightness - 0.5) / 0.5
                $r = (0.84 * (1.0 - $t)) + (0.995 * $t)
                $g = (0.67 * (1.0 - $t)) + (0.91 * $t)
                $b = (0.16 * (1.0 - $t)) + (0.50 * $t)
            }
        }
        default {
            throw "Unsupported tone '$Tone'."
        }
    }

    return [System.Drawing.Color]::FromArgb(
        [int](255 * (Clamp-Unit $r)),
        [int](255 * (Clamp-Unit $g)),
        [int](255 * (Clamp-Unit $b))
    )
}

function Get-GoldMask {
    param(
        [double]$Hue,
        [double]$Sat,
        [double]$Lum
    )

    if ($Hue -lt 34.0 -or $Hue -gt 58.0) {
        return 0.0
    }

    if ($Sat -lt 0.22 -or $Lum -lt 0.28 -or $Lum -gt 0.93) {
        return 0.0
    }

    $hueStrength = 1.0 - ([Math]::Abs($Hue - 46.0) / 12.0)
    $satStrength = [Math]::Min(1.0, ($Sat - 0.22) / 0.35)
    $lumStrength = [Math]::Min(1.0, ($Lum - 0.28) / 0.30)

    return Clamp-Unit ($hueStrength * 0.5 + $satStrength * 0.3 + $lumStrength * 0.2)
}

function Get-SilverMask {
    param(
        [double]$Sat,
        [double]$Lum
    )

    if ($Sat -gt 0.10 -or $Lum -lt 0.45 -or $Lum -gt 0.86) {
        return 0.0
    }

    $satStrength = [Math]::Min(1.0, (0.10 - $Sat) / 0.10)
    $lumStrength = [Math]::Min(1.0, ($Lum - 0.45) / 0.20)
    $upperFalloff = [Math]::Min(1.0, (0.86 - $Lum) / 0.12)

    return Clamp-Unit (($satStrength * 0.4) + ($lumStrength * 0.3) + ($upperFalloff * 0.3))
}

function Apply-MetallicFinish {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [string]$Tone
    )

    $source = [System.Drawing.Bitmap]::FromFile($InputPath)
    $output = New-Object System.Drawing.Bitmap($source.Width, $source.Height)

    try {
        for ($y = 0; $y -lt $source.Height; $y++) {
            $yn = $y / [double]($source.Height - 1)

            for ($x = 0; $x -lt $source.Width; $x++) {
                $xn = $x / [double]($source.Width - 1)
                $pixel = $source.GetPixel($x, $y)

                $r = $pixel.R / 255.0
                $g = $pixel.G / 255.0
                $b = $pixel.B / 255.0
                $lum = Get-Luminance -R $r -G $g -B $b
                $sat = Get-Saturation -R $r -G $g -B $b
                $hue = Get-HueDegrees -R $r -G $g -B $b

                if ($Tone -eq 'gold') {
                    $mask = Get-GoldMask -Hue $hue -Sat $sat -Lum $lum
                }
                else {
                    $mask = Get-SilverMask -Sat $sat -Lum $lum
                }

                if ($mask -le 0.0) {
                    $output.SetPixel($x, $y, $pixel)
                    continue
                }

                $bands = Get-MetallicBands -Xn $xn -Yn $yn
                $noise = Get-BrushedNoise -X $x -Y $y
                $metalLightness = Clamp-Unit(($lum * 0.90) + 0.06 + $bands + $noise)
                $metal = Get-MetalColor -Tone $Tone -Lightness $metalLightness

                $blend = if ($Tone -eq 'gold') { 0.93 * $mask } else { 0.89 * $mask }
                $outR = [int](($pixel.R * (1.0 - $blend)) + ($metal.R * $blend))
                $outG = [int](($pixel.G * (1.0 - $blend)) + ($metal.G * $blend))
                $outB = [int](($pixel.B * (1.0 - $blend)) + ($metal.B * $blend))

                $output.SetPixel(
                    $x,
                    $y,
                    [System.Drawing.Color]::FromArgb($pixel.A, $outR, $outG, $outB)
                )
            }
        }

        $directory = Split-Path -Parent $OutputPath
        if (-not (Test-Path $directory)) {
            New-Item -ItemType Directory -Path $directory -Force | Out-Null
        }

        $tempPath = Join-Path $directory ([System.IO.Path]::GetFileNameWithoutExtension($OutputPath) + '-tmp.png')
        if (Test-Path $tempPath) {
            Remove-Item -LiteralPath $tempPath -Force
        }

        $output.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)

        if (Test-Path $OutputPath) {
            Remove-Item -LiteralPath $OutputPath -Force
        }

        Move-Item -LiteralPath $tempPath -Destination $OutputPath -Force
    }
    finally {
        $source.Dispose()
        $output.Dispose()
    }
}

Apply-MetallicFinish -InputPath $PuttyInput -OutputPath (Join-Path $OutputDir 'BCS-Putty-metallic-gold.png') -Tone 'gold'
Apply-MetallicFinish -InputPath $SealerInput -OutputPath (Join-Path $OutputDir 'BCS-Sealer-metallic-silver.png') -Tone 'silver'

Write-Output "Created metallic pack shots in $OutputDir"
